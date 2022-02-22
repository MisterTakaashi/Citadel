import * as Router from 'koa-router';
import { Context } from 'koa';

import PingController from './controllers/ping';
import InstanceController from './controllers/instance';

const router = new Router();

// Ping
router.get('/ping', async (ctx: Context) => {
  await new PingController().index(ctx);
});

// Instance
router.get('/instances', async (ctx: Context) => {
  await new InstanceController().index(ctx);
});

router.post('/instances', async (ctx: Context) => {
  await new InstanceController().create(ctx);
});

router.post('/instances/:name/start', async (ctx: Context) => {
  await new InstanceController().start(ctx);
});

export default router;
