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
      instances: gameContainers.map(({ Id, Names, Image, State }) => ({
        id: Id,
        name: Names[0],
        image: Image,
        state: State,
      })),
    });
  }

  // POST /instances
  async create(ctx: Context) {
    const { image } = ctx.request.body;

    const docker = new Docker();
    await pullImage(docker, image);

    await docker.createContainer({
      Image: image,
      name: `citadel_${image.split(':')[0]}`,
    });

    this.renderSuccess(ctx, {
      instances: { image },
    });
  }
}

export default InstanceController;
