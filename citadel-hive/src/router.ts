import * as Router from 'koa-router';

import ServerController from './controllers/server';
import InstanceController from './controllers/instance';
import ImageController from './controllers/image';

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

router.post('/instances/:name/start', async (ctx) => {
  await new InstanceController().start(ctx);
});

router.post('/instances/:name/stop', async (ctx) => {
  await new InstanceController().stop(ctx);
});

router.get('/instances/:name/logs', async (ctx) => {
  await new InstanceController().logs(ctx);
});

// Servers
router.get('/servers', async (ctx) => {
  await new ServerController().index(ctx);
});

router.post('/servers', async (ctx) => {
  await new ServerController().create(ctx);
});

// Images
router.get('/images', async (ctx) => {
  await new ImageController().index(ctx);
});

export default router;
