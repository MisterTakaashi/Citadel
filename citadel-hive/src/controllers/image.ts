import { Request, Response } from 'express';
import { renderSuccess, games } from 'citadel-lib';
import { getImageConfig } from '../lib/config-query';

class ImageController {
  // GET /images
  async index(_: Request, res: Response) {
    renderSuccess(res, {
      images: games,
    });
  }

  // GET /images/:image
  async details(req: Request, res: Response) {
    const { image } = req.params;

    renderSuccess(res, {
      image: await getImageConfig(image),
    });
  }
}

export default ImageController;
