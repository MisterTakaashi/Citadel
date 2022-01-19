import * as koa from 'koa';
import * as koaJson from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import { connect } from 'mongoose';

import router from './router';

(async () => {
  await connect(`mongodb://localhost:27017/citadel_${process.env.NODE_ENV || 'development'}`);

  const port = process.env.PORT || 3000;

  const app = new koa();
  app.use(koaJson());
  app.use(koaBodyParser());
  app.use(router.routes());

  app.listen(port, () => {
    console.log('Server listening on port', port);
  });
})();
