import * as Docker from 'dockerode';
import { Context } from 'koa';
import { commonControllers } from 'citadel-lib';
import DockerProvider from '../providers/docker';

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

    const provider = new DockerProvider(new Docker());
    await provider.fetchBinaries(image);

    const instanceName = await provider.createInstance(image);
    await provider.startInstance(instanceName);

    this.renderSuccess(ctx, {
      instances: { image },
    });
  }

  // POST /instances/:name/start
  async start(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const provider = new DockerProvider(new Docker());
    provider.startInstance(name);

    // TODO: Add a normalized method to get infos of an instance
    this.renderSuccess(ctx, { instance: null });
  }
}

export default InstanceController;
