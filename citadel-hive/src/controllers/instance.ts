import { commonControllers } from 'citadel-lib';
import { InstanceModel } from '../models/instance';
import { Context } from 'koa';

class InstanceController extends commonControllers.ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      instances: await InstanceModel.find(),
    });
  }

  // POST /instances
  async create(ctx: Context) {
    const newInstance = new InstanceModel(ctx.request.body);

    this.renderSuccess(ctx, {
      instance: await newInstance.save(),
    });
  }
}

export default InstanceController;
