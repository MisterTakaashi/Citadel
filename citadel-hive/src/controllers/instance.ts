import { commonControllers } from 'citadel-lib';
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
    const { drone, image, name, config } = ctx.request.body;
    const server = await ServerModel.findOne({ name: drone });
    if (!server) {
      this.renderError(ctx, 404, `Cannot find drone "${drone}"`);
      return;
    }

    const instance = await queryDrone(server, 'instances', 'instance', 'post', { image, name, config });

    if (!instance) {
      this.renderError(ctx, 401, `Cannot create instance on drone "${drone}"`);
      return;
    }

    this.renderSuccess(ctx, {
      instance,
    });
  }

  // DELETE /instances/:name
  async remove(ctx: Context) {
    const { name } = ctx.params;
    const instances = await queryDrones(await ServerModel.find(), 'instances');

    const instance = instances.find((currentInstance) => currentInstance.name === name);
    if (!instance) {
      this.renderError(ctx, 401, `Cannot find instance named "${name}"`);
      return;
    }

    const server = await ServerModel.findOne({ name: instance.server.name });

    const result = await queryDrone(server, `instances/${name}`, 'instances', 'delete');
    if (result.code >= 400) {
      return this.renderError(ctx, result.code, result.error);
    }

    this.renderSuccess(ctx, {});
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

  // GET /instances/:name/logs
  async logs(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const instances = await queryDrones(await ServerModel.find(), 'instances');

    const instance = instances.find((currentInstance) => currentInstance.name === name);

    const result = await queryDrone(instance.server, `instances/${name}/logs`, 'logs', 'get');

    this.renderSuccess(ctx, result);
  }
}

export default InstanceController;
