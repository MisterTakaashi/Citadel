import * as koa from 'koa';
import * as koaJson from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import * as cors from '@koa/cors';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import { ulid } from 'ulid';

import router from './router';
import makeLogger from './lib/logger';

(async () => {
  config();

  await connect(`mongodb://localhost:27017/citadel_${process.env.NODE_ENV || 'development'}`);

  const logger = makeLogger(module);

  const port = process.env.PORT || 3000;

  const app = new koa();
  app.use(cors({ origin: '*' }));
  app.use(koaJson());
  app.use(koaBodyParser());
  app.use(async (ctx, next) => {
    const requestId = ulid();
    logger.info(`${ctx.method}[${requestId}] ${ctx.path}`);
    await next();
    logger.info(`${ctx.method}[${requestId}] ${ctx.path} ${ctx.res.statusCode}`);
  });
  app.use(router.routes());

  app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
})();
