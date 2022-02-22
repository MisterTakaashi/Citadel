import * as Router from 'koa-router';

import ServerController from './controllers/server';
import InstanceController from './controllers/instance';

const router = new Router();

// Instances
router.get('/instances', async (ctx) => {
  await new InstanceController().index(ctx);
});

router.post('/instances', async (ctx) => {
  await new InstanceController().create(ctx);
});

router.get('/instances/:name', async (ctx) => {
  await new InstanceController().details(ctx);
});

// Servers
router.get('/servers', async (ctx) => {
  await new ServerController().index(ctx);
});

router.post('/servers', async (ctx) => {
  await new ServerController().create(ctx);
});

export default router;
