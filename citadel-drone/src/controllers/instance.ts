import * as Docker from 'dockerode';
import { Context } from 'koa';

import ApplicationController from './application';

class InstanceController extends ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    const docker = new Docker();

    const containers = await docker.listContainers();
    const gameContainers = containers.filter((currentContainer) => /^citadel_\d{1,6}$/.test(currentContainer.Image));

    this.renderSuccess(ctx, {
      servers: gameContainers,
    });
  }

  // POST /instances
  async create(ctx: Context) {
    console.log(ctx.request.body);
    // const gameServer = new GameServerModel();

    this.renderSuccess(ctx, {
      servers: [],
    });
  }
}

export default InstanceController;
