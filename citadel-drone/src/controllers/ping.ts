import { Context } from 'koa';
import ApplicationController from './application';

class PingController extends ApplicationController {
  // GET /ping
  async index(ctx: Context) {
    this.renderSuccess(ctx, { ping: 'pong' });
  }
}

export default PingController;
