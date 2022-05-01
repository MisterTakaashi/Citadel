import { commonControllers, games } from 'citadel-lib';
import { Context } from 'koa';
import { getImageConfig } from '../lib/config-query';

class ImageController extends commonControllers.ApplicationController {
  // GET /images
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      images: games,
    });
  }

  // GET /images/:image
  async details(ctx: Context) {
    const { image } = ctx.params;

    this.renderSuccess(ctx, {
      image: await getImageConfig(image),
    });
  }
}

export default ImageController;
