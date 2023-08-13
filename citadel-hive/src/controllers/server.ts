import { InstanceInfo, SyncMessage, commonControllers } from 'citadel-lib';
import Server, { ServerModel } from '../models/server';
import { Context } from 'koa';
import { ulid } from 'ulid';
import generateName from '../lib/name-generator';
import { InstanceModel } from '../models/instance';
import { Promise as PromiseBB } from 'bluebird';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

class ServerController extends commonControllers.ApplicationController {
  // GET /servers
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      servers: await ServerModel.find(),
    });
  }

  // POST /servers
  async create(ctx: Context) {
    const { session } = ctx;

    const newServer = new ServerModel({
      name: 'unregistered',
      token: ulid(),
      selfHosted: true,
      publicIp: '0.0.0.0',
      owner: session.account,
    });

    this.renderSuccess(ctx, {
      token: (await newServer.save()).token,
    });
  }

  // POST /servers/register
  async register(ctx: Context) {
    const { token } = ctx.server;

    const server = await ServerModel.findOne({ token });

    if (!server) {
      this.renderError(ctx, 401, 'Cannot register server with this token');
      return;
    }

    if (server.registered) {
      this.renderSuccess(ctx, { server });
      return;
    }

    const existingServers = (await ServerModel.find({ owner: server.owner }))
      .filter((currentServer) => currentServer.name !== 'unregistered')
      .reverse();

    let lastNameUsed = null;
    if (existingServers.length > 0) {
      lastNameUsed = existingServers[0].name;
    }

    server.publicIp = ctx.request.ip;
    server.name = generateName(lastNameUsed);
    server.registered = true;

    this.renderSuccess(ctx, {
      server: await server.save(),
    });
  }

  // PUT /servers/sync
  async sync(ctx: Context & { server: Server; request: { body: SyncMessage } }) {
    const { token } = ctx.server;
    const { instances } = ctx.request.body;

    const server = await ServerModel.findOne({ token });

    if (!server) {
      this.renderError(ctx, 401, 'Cannot register server with this token');
      return;
    }

    if (!server.registered) {
      this.renderError(ctx, 400, 'Server not yet registered to the Hive');
      return;
    }

    server.lastSync = new Date();
    await server.save();

    await PromiseBB.each(instances, async (instance: InstanceInfo) => {
      const existingInstance = await InstanceModel.findOne({ name: instance.name, drone: server });

      if (!existingInstance) {
        logger.info(`Server (${server.name}) registered a new instance (${instance.name})`);
        await InstanceModel.create({ drone: server, name: instance.name, infos: instance });
      }
    });

    this.renderSuccess(ctx, {});
  }
}

export default ServerController;
