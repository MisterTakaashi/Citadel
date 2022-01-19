import ApplicationController from './application';
import ServerModel from '../models/server';
import { Context } from 'koa';

class ServerController extends ApplicationController {
  // GET /servers
  async index(ctx: Context) {
    this.renderSuccess<{ servers: typeof ServerModel[] }>(ctx, {
      servers: await ServerModel.find(),
    });
  }

  // POST /servers
  async create(ctx: Context) {
    const newServer = new ServerModel(ctx.request.body);

    this.renderSuccess<{ server: typeof ServerModel }>(ctx, {
      server: await newServer.save(),
    });
  }
}

export default ServerController;
