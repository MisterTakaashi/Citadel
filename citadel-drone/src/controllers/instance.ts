import * as Docker from 'dockerode';
import { Context } from 'koa';
import { commonControllers } from 'citadel-lib';
import DockerProvider from '../providers/docker';

class InstanceController extends commonControllers.ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    const provider = new DockerProvider(new Docker());

    this.renderSuccess(ctx, {
      instances: await provider.getInstances(),
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
      instance: { image },
    });
  }

  // POST /instances/:name/start
  async start(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const provider = new DockerProvider(new Docker());
    try {
      await provider.startInstance(name);
    } catch (err) {
      this.renderError(ctx, 400, err.reason);
      return;
    }

    this.renderSuccess(ctx, { instance: await provider.getInstance(name) });
  }

  // POST /instances/:name/stop
  async stop(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const provider = new DockerProvider(new Docker());
    try {
      await provider.stopInstance(name);
    } catch (err) {
      this.renderError(ctx, 400, err.reason);
      return;
    }

    this.renderSuccess(ctx, { instance: await provider.getInstance(name) });
  }

  // GET /instances/:name/logs
  async logs(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const provider = new DockerProvider(new Docker());
    const logs = await provider.getLogs(name);

    this.renderSuccess(ctx, { logs });
  }
}

export default InstanceController;
