import { commonControllers, games } from 'citadel-lib';
import { Context } from 'koa';

class ImageController extends commonControllers.ApplicationController {
  // GET /images
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      images: games,
    });
  }
}

export default ImageController;
