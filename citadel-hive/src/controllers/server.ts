import { commonControllers } from 'citadel-lib';
import { ServerModel } from '../models/server';
import { Context } from 'koa';

class ServerController extends commonControllers.ApplicationController {
  // GET /servers
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      servers: await ServerModel.find(),
    });
  }

  // POST /servers
  async create(ctx: Context) {
    const newServer = new ServerModel(ctx.request.body);

    this.renderSuccess(ctx, {
      server: await newServer.save(),
    });
  }
}

export default ServerController;
