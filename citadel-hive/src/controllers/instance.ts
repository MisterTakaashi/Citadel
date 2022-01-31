import * as Bluebird from 'bluebird';
import { commonControllers } from 'citadel-lib';
import { InstanceModel } from '../models/instance';
import Server, { ServerModel } from '../models/server';
import { Context } from 'koa';
import queryDrone from '../lib/drone-query';

class InstanceController extends commonControllers.ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    const servers = await ServerModel.find();

    const results = await Bluebird.map(servers, (currentServer: Server) => queryDrone(currentServer.url, 'instances'));

    const instances = results.reduce((acc, currentResult) => {
      if (currentResult.error) {
        return acc;
      }

      return [...acc, ...currentResult.response];
    }, []);

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
}

export default InstanceController;
