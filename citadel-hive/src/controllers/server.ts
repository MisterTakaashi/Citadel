import { commonControllers } from 'citadel-lib';
import { ServerModel } from '../models/server';
import { Context } from 'koa';
import { ulid } from 'ulid';
import generateName from '../lib/name-generator';

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
      this.renderError(ctx, 400, 'Server already registered');
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
}

export default ServerController;
