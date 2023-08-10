import * as Router from 'koa-router';

import ServerController from './controllers/server';
import InstanceController from './controllers/instance';
import ImageController from './controllers/image';
import AccountController from './controllers/account';
import SessionController from './controllers/session';
import JobController from './controllers/job';
import { validateAuthentication, validateServerAuthentication } from './lib/auth-middleware';

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

router.delete('/instances/:name', async (ctx) => {
  await new InstanceController().remove(ctx);
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

router.post('/servers', validateAuthentication, async (ctx) => {
  await new ServerController().create(ctx);
});

router.post('/servers/register', validateServerAuthentication, async (ctx) => {
  await new ServerController().register(ctx);
});

// Images
router.get('/images', async (ctx) => {
  await new ImageController().index(ctx);
});

router.get('/images/:image', async (ctx) => {
  await new ImageController().details(ctx);
});

// Accounts
router.post('/accounts', async (ctx) => {
  await new AccountController().create(ctx);
});

// Sessions
router.get('/sessions/:token', async (ctx) => {
  await new SessionController().details(ctx);
});

router.post('/sessions', async (ctx) => {
  await new SessionController().create(ctx);
});

// Jobs
router.get('/jobs', async (ctx) => {
  await new JobController().index(ctx);
});

export default router;
