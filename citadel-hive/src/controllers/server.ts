import { commonControllers } from 'citadel-lib';
import { ServerModel } from '../models/server';
import { Context } from 'koa';
import { queryDrone } from '../lib/drone-query';
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
    const { url } = ctx.request.body;

    const { response, error } = await queryDrone({ url, publicIp: '', name: '', selfHosted: true }, 'ping', 'ip');

    if (error) {
      this.renderError(ctx, 400, 'Cannot contact the drone to get its public IP');
      return;
    }

    const newServer = new ServerModel({ url, publicIp: response, name: generateName(), selfHosted: true });

    this.renderSuccess(ctx, {
      server: await newServer.save(),
    });
  }
}

export default ServerController;
