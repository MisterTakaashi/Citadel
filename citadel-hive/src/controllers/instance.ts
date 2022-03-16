import { commonControllers } from 'citadel-lib';
import { InstanceModel } from '../models/instance';
import { ServerModel } from '../models/server';
import { Context } from 'koa';
import { queryDrone, queryDrones } from '../lib/drone-query';

class InstanceController extends commonControllers.ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    const instances = await queryDrones(await ServerModel.find(), 'instances');

    this.renderSuccess(ctx, {
      instances,
    });
  }

  // POST /instances
  async create(ctx: Context) {
    const newInstance = new InstanceModel(ctx.request.body);

    this.renderSuccess(ctx, {
      instance: await newInstance.save(),
    });
  }

  // GET /instances/:name
  async details(ctx: Context) {
    const { name } = ctx.params;

    const instances = await queryDrones(await ServerModel.find(), 'instances');

    const instance = instances.find((currentInstance) => currentInstance.name === name);

    if (!instance) {
      this.renderError(ctx, 404, `Cannot find instance "${name}"`);
      return;
    }

    this.renderSuccess(ctx, {
      instance,
    });
  }

  // POST /instances/:name/start
  async start(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const instances = await queryDrones(await ServerModel.find(), 'instances');

    const instance = instances.find((currentInstance) => currentInstance.name === name);

    const result = await queryDrone(instance.server, `instances/${name}/start`, 'instance', 'post');

    if (result.error) {
      this.renderError(ctx, result.code, result.error);
      return;
    }

    this.renderSuccess(ctx, result);
  }

  // POST /instances/:name/stop
  async stop(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const instances = await queryDrones(await ServerModel.find(), 'instances');

    const instance = instances.find((currentInstance) => currentInstance.name === name);

    const result = await queryDrone(instance.server, `instances/${name}/stop`, 'instance', 'post');

    if (result.error) {
      this.renderError(ctx, result.code, result.error);
      return;
    }

    this.renderSuccess(ctx, result);
  }
}

export default InstanceController;
