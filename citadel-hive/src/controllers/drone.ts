import { InstanceInfo, SyncMessage, renderError, renderSuccess } from '@citadelnest/lib';
import { Request, Response } from 'express';
import Drone, { DroneModel } from '../models/drone';
import { ulid } from 'ulid';
import generateName from '../lib/name-generator';
import { InstanceModel } from '../models/instance';
import { Promise as PromiseBB } from 'bluebird';
import makeLogger from '../lib/logger';
import Session from '../models/session';
import { getRedisClient } from '../lib/redis';

const logger = makeLogger(module);

class DroneController {
  // GET /drones
  async index(req: Request, res: Response) {
    renderSuccess(res, {
      drones: await DroneModel.find({}),
    });
  }

  // GET /drone/:name
  async show(req: Request, res: Response) {
    const { name } = req.params;

    renderSuccess(res, { drone: await DroneModel.findOne({ name }) });
  }

  // GET /drone
  async connected(req: Request & { drone: Drone }, res: Response) {
    const { token } = req.drone;

    const drone = await DroneModel.findOne({ token });

    renderSuccess(res, { drone });
  }

  // POST /drones
  async create(req: Request & { session: Session }, res: Response) {
    const { session } = req;

    const newDrone = new DroneModel({
      name: 'unregistered',
      token: ulid(),
      selfHosted: true,
      publicIp: '0.0.0.0',
      owner: session.account,
    });

    renderSuccess(res, {
      token: (await newDrone.save()).token,
    });
  }

  // POST /drones/register
  async register(req: Request & { drone: Drone }, res: Response) {
    const { token } = req.drone;

    const drone = await DroneModel.findOne({ token });

    if (!drone) {
      renderError(res, 401, 'Cannot register drone with this token');
      return;
    }

    if (drone.registered) {
      renderSuccess(res, { drone });
      return;
    }

    const existingDrones = (await DroneModel.find({ owner: drone.owner }))
      .filter((currentDrone) => currentDrone.name !== 'unregistered')
      .reverse();

    let lastNameUsed = null;
    if (existingDrones.length > 0) {
      lastNameUsed = existingDrones[0].name;
    }

    drone.publicIp = req.ip;
    drone.name = generateName(lastNameUsed);
    drone.registered = true;

    renderSuccess(res, {
      drone: await drone.save(),
    });
  }

  // PUT /drones/sync
  async sync(req: Request & { drone: Drone }, res: Response & { drone: Drone; request: { body: SyncMessage } }) {
    const { token } = req.drone;
    const { instances, instancesLogs } = req.body as SyncMessage;

    const redis = await getRedisClient();

    const drone = await DroneModel.findOne({ token });

    if (!drone) {
      renderError(res, 401, 'Cannot register drone with this token');
      return;
    }

    if (!drone.registered) {
      renderError(res, 400, 'Drone not yet registered to the Hive');
      return;
    }

    drone.lastSync = new Date();
    await drone.save();

    await PromiseBB.each(instances, async (instance) => {
      const existingInstance = await InstanceModel.findOne({ name: instance.name, drone: drone });

      if (!existingInstance) {
        logger.info(`Drone (${drone.name}) registered a new instance (${instance.name})`);
        await InstanceModel.create({ drone: drone, name: instance.name, infos: instance });
      } else {
        existingInstance.infos = instance;
        await existingInstance.save();
      }
    });

    await InstanceModel.deleteMany({ drone: drone, name: { $nin: instances.map((instance) => instance.name) } });

    await PromiseBB.each(Object.entries(instancesLogs), async ([instanceName, logs]) => {
      const logKey = `instances:${instanceName}:logs`;

      const existingLogEntries = (await redis.keys(`${logKey}:*`)).sort((a, b) => a.localeCompare(b));
      if (existingLogEntries.length > 10) {
        const entriestoDelete = existingLogEntries.splice(0, existingLogEntries.length - 10);
        await redis.del(entriestoDelete);
      }

      await PromiseBB.each(logs, async (log) => {
        console.log('Adding', log);
        await redis.rPush(`${logKey}:${Math.floor(Date.now() / 1000)}`, log);
      });
    });

    renderSuccess(res, {});
  }
}

export default DroneController;
