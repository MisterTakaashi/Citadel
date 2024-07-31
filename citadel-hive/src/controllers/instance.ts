import { Request, Response } from 'express';
import * as PromiseBB from 'bluebird';
import { renderError, renderSuccess, InstanceVolume, JobStatus, JobType } from '@citadelnest/lib';
import { DroneModel } from '../models/drone';
import { getImageConfig } from '../lib/config-query';
import { JobModel } from '../models/job';
import { InstanceModel } from '../models/instance';
import Session from '../models/session';
import { getRedisClient } from '../lib/redis';

interface InstanceCreateRequest {
  drone: string;
  image: string;
  name: string;
  config: any;
}

class InstanceController {
  // GET /instances
  async index(_: Request, res: Response) {
    renderSuccess(res, {
      instances: await InstanceModel.find({}),
    });
  }

  // POST /instances
  async create(req: Request, res: Response) {
    const { drone: droneName, image, name, config } = req.body as InstanceCreateRequest;
    const drone = await DroneModel.findOne({ name: droneName });
    if (!drone) {
      renderError(res, 404, `Cannot find drone "${drone}"`);
      return;
    }

    const imageConfig = await getImageConfig(image);
    const volumes =
      config.volumes?.map((volume: InstanceVolume) => {
        const registeredPersistence = imageConfig.persistences.find((persistence) => persistence.name === volume.to);
        if (registeredPersistence) {
          volume.to = registeredPersistence.path;
        }

        return volume;
      }) || [];

    const job = new JobModel({
      jobType: JobType.CREATE_INSTANCE,
      status: JobStatus.CREATED,
      drone: drone,
      parameters: {
        image: imageConfig.docker.image,
        name,
        config: { ...config, volumes },
      },
    });
    await job.save();

    renderSuccess(res, {
      job,
    });
  }

  // DELETE /instances/:name
  async remove(req: Request & { session: Session }, res: Response) {
    const { name } = req.params;
    const { session } = req;

    const userDrones = await DroneModel.find({ owner: session.account });

    const instance = await InstanceModel.findOne({ name, drone: { $in: userDrones } });

    const job = new JobModel({
      jobType: JobType.DELETE_INSTANCE,
      status: JobStatus.CREATED,
      parameters: { instance: name },
      drone: instance.drone,
    });
    await job.save();

    renderSuccess(res, job);
  }

  // GET /instances/:name
  async details(req: Request, res: Response) {
    const { name } = req.params;

    const instance = await InstanceModel.findOne({ name }).populate('drone');

    if (!instance) {
      renderError(res, 404, `Cannot find instance "${name}"`);
      return;
    }

    renderSuccess(res, {
      instance,
    });
  }

  // POST /instances/:name/start
  async start(req: Request & { session: Session }, res: Response) {
    const { name } = req.params as { name: string };
    const { session } = req;

    const userDrones = await DroneModel.find({ owner: session.account });

    const instance = await InstanceModel.findOne({ name, drone: { $in: userDrones } });

    const job = new JobModel({
      jobType: JobType.START_INSTANCE,
      status: JobStatus.CREATED,
      parameters: { instance: name },
      drone: instance.drone,
    });
    await job.save();

    renderSuccess(res, job);
  }

  // POST /instances/:name/stop
  async stop(req: Request & { session: Session }, res: Response) {
    const { name } = req.params as { name: string };

    const { session } = req;

    const userDrones = await DroneModel.find({ owner: session.account });

    const instance = await InstanceModel.findOne({ name, drone: { $in: userDrones } });

    const job = new JobModel({
      jobType: JobType.STOP_INSTANCE,
      status: JobStatus.CREATED,
      parameters: { instance: name },
      drone: instance.drone,
    });

    await job.save();

    renderSuccess(res, job);
  }

  // GET /instances/:name/logs
  async logs(req: Request, res: Response) {
    const { name } = req.params as { name: string };

    const redis = await getRedisClient();

    const logKey = `instances:${name}:logs`;
    const existingLogEntries = (await redis.keys(`${logKey}:*`)).sort((a, b) => a.localeCompare(b));
    const logs = await PromiseBB.reduce(
      existingLogEntries,
      async (acc, existingLogEntry) => [...acc, ...(await redis.lRange(existingLogEntry, 0, -1))],
      []
    );

    renderSuccess(res, { logs });
  }
}

export default InstanceController;
