import { Context } from 'koa';
import { commonControllers } from 'citadel-lib';

class PingController extends commonControllers.ApplicationController {
  // GET /ping
  async index(ctx: Context) {
    this.renderSuccess(ctx, { ping: 'pong', ip: '127.0.0.1' });
  }
}

export default PingController;
