import { commonControllers, games } from 'citadel-lib';
import { Context } from 'koa';
import axios from 'axios';

const CONFIGS_REGISTRY_URL = 'https://raw.githubusercontent.com/MisterTakaashi/Citadel/master/citadel-images';

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
    const result = await axios.get(`${CONFIGS_REGISTRY_URL}/${image}/config.json`);

    this.renderSuccess(ctx, { image: result.data });
  }
}

export default ImageController;
