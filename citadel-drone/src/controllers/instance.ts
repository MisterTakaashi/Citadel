import * as Docker from 'dockerode';
import { Context } from 'koa';
import { commonControllers } from 'citadel-lib';
import { pullImage } from '../lib/docker';

class InstanceController extends commonControllers.ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    const docker = new Docker();

    const containers = await docker.listContainers({ all: true });
    console.log(containers);
    const gameContainers = containers.filter((currentContainer) =>
      currentContainer.Names.find((currentName) => currentName.startsWith('/citadel_'))
    );

    this.renderSuccess(ctx, {
      servers: gameContainers,
    });
  }

  // POST /instances
  async create(ctx: Context) {
    const { body } = ctx.request;

    const docker = new Docker();
    await pullImage(docker, 'mysql:latest');

    await docker.createContainer({
      Image: 'mysql:latest',
      name: 'citadel_mysql',
    });

    this.renderSuccess(ctx, {
      servers: body,
    });
  }
}

export default InstanceController;
