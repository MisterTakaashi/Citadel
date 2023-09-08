import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import { config } from 'dotenv';
import { connect } from 'mongoose';

import router from './router';
import makeLogger from './lib/logger';
import { initRedis } from './lib/redis';

(async () => {
  config();

  await connect(`mongodb://localhost:27017/citadel_${process.env.NODE_ENV || 'development'}`);
  await initRedis();

  const logger = makeLogger(module);

  const port = process.env.PORT || 3000;

  const app = express();
  app.use(cors({ origin: '*' }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined', { stream: logger.stream as unknown as morgan.StreamOptions }));
  app.use(router);

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
})();
