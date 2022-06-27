import * as koa from 'koa';
import * as koaJson from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import { ulid } from 'ulid';
import makeLogger from './lib/logger';

import router from './router';

(async () => {
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
