import * as koa from 'koa';
import * as koaJson from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';

import router from './router';

(async () => {
  const port = process.env.PORT || 3001;

  const app = new koa();
  app.use(koaJson());
  app.use(koaBodyParser());
  app.use(router.routes());

  app.listen(port, () => {
    console.log('Server listening on port', port);
  });
})();
