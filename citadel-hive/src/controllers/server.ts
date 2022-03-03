import { commonControllers } from 'citadel-lib';
import { ServerModel } from '../models/server';
import { Context } from 'koa';
import { queryDrone } from '../lib/drone-query';

class ServerController extends commonControllers.ApplicationController {
  // GET /servers
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      servers: await ServerModel.find(),
    });
  }

  // POST /servers
  async create(ctx: Context) {
    const { url } = ctx.request.body;

    const { response, error } = await queryDrone({ url, publicIp: '' }, 'ping', 'ip');

    if (error) {
      this.renderError(ctx, 400, 'Cannot contact the drone to get its public IP');
      return;
    }

    const newServer = new ServerModel({ url, publicIp: response });

    this.renderSuccess(ctx, {
      server: await newServer.save(),
    });
  }
}

export default ServerController;
