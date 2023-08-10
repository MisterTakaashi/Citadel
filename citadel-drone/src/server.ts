import koa from 'koa';
import koaJson from 'koa-json';
import koaBodyParser from 'koa-bodyparser';
import { ulid } from 'ulid';
import dotenv from 'dotenv';
import makeLogger from './lib/logger';
import connectToHive from './lib/hive';

import router from './router';

(async () => {
  dotenv.config();

  connectToHive();

  const logger = makeLogger(module);

  const port = process.env.PORT || 3001;

  const app = new koa();
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
