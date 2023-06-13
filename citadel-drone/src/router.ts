import Router from 'koa-router';
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

router.delete('/instances/:name', async (ctx: Context) => {
  await new InstanceController().remove(ctx);
});

router.post('/instances/:name/start', async (ctx: Context) => {
  await new InstanceController().start(ctx);
});

router.post('/instances/:name/stop', async (ctx: Context) => {
  await new InstanceController().stop(ctx);
});

router.get('/instances/:name/logs', async (ctx: Context) => {
  await new InstanceController().logs(ctx);
});

export default router;
