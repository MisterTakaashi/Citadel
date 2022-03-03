import { Context } from 'koa';
import * as publicIp from 'public-ip';
import { commonControllers } from 'citadel-lib';

class PingController extends commonControllers.ApplicationController {
  // GET /ping
  async index(ctx: Context) {
    this.renderSuccess(ctx, { ping: 'pong', ip: await publicIp.v4() });
  }
}

export default PingController;
