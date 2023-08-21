import { InstanceInfo, SyncMessage, renderError, renderSuccess } from 'citadel-lib';
import { Request, Response } from 'express';
import Server, { ServerModel } from '../models/server';
import { ulid } from 'ulid';
import generateName from '../lib/name-generator';
import { InstanceModel } from '../models/instance';
import { Promise as PromiseBB } from 'bluebird';
import makeLogger from '../lib/logger';
import Session from '../models/session';

const logger = makeLogger(module);

class ServerController {
  // GET /servers
  async index(req: Request, res: Response) {
    renderSuccess(res, {
      servers: await ServerModel.find({}),
    });
  }

  // POST /servers
  async create(req: Request & { session: Session }, res: Response) {
    const { session } = req;

    const newServer = new ServerModel({
      name: 'unregistered',
      token: ulid(),
      selfHosted: true,
      publicIp: '0.0.0.0',
      owner: session.account,
    });

    renderSuccess(res, {
      token: (await newServer.save()).token,
    });
  }

  // POST /servers/register
  async register(req: Request & { server: Server }, res: Response) {
    const { token } = req.server;

    const server = await ServerModel.findOne({ token });

    if (!server) {
      renderError(res, 401, 'Cannot register server with this token');
      return;
    }

    if (server.registered) {
      renderSuccess(res, { server });
      return;
    }

    const existingServers = (await ServerModel.find({ owner: server.owner }))
      .filter((currentServer) => currentServer.name !== 'unregistered')
      .reverse();

    let lastNameUsed = null;
    if (existingServers.length > 0) {
      lastNameUsed = existingServers[0].name;
    }

    server.publicIp = req.ip;
    server.name = generateName(lastNameUsed);
    server.registered = true;

    renderSuccess(res, {
      server: await server.save(),
    });
  }

  // PUT /servers/sync
  async sync(req: Request & { server: Server }, res: Response & { server: Server; request: { body: SyncMessage } }) {
    const { token } = req.server;
    const { instances } = req.body as { instances: InstanceInfo[] };

    const server = await ServerModel.findOne({ token });

    if (!server) {
      renderError(res, 401, 'Cannot register server with this token');
      return;
    }

    if (!server.registered) {
      renderError(res, 400, 'Server not yet registered to the Hive');
      return;
    }

    server.lastSync = new Date();
    await server.save();

    await PromiseBB.each(instances, async (instance) => {
      const existingInstance = await InstanceModel.findOne({ name: instance.name, drone: server });

      if (!existingInstance) {
        logger.info(`Server (${server.name}) registered a new instance (${instance.name})`);
        await InstanceModel.create({ drone: server, name: instance.name, infos: instance });
      } else {
        existingInstance.infos = instance;
        await existingInstance.save();
      }
    });

    await InstanceModel.deleteMany({ drone: server, name: { $nin: instances.map((instance) => instance.name) } });

    renderSuccess(res, {});
  }
}

export default ServerController;
