import { Router } from 'express';

import ServerController from './controllers/server';
import InstanceController from './controllers/instance';
import ImageController from './controllers/image';
import AccountController from './controllers/account';
import SessionController from './controllers/session';
import JobController from './controllers/job';
import { validateAuthentication, validateServerAuthentication } from './lib/auth-middleware';

const router = Router();

// Instances
router.get('/instances', validateAuthentication, new InstanceController().index);

router.post('/instances', validateAuthentication, new InstanceController().create);

router.get('/instances/:name', validateAuthentication, new InstanceController().details);

router.delete('/instances/:name', validateAuthentication, new InstanceController().remove);

router.post('/instances/:name/start', validateAuthentication, new InstanceController().start);

router.post('/instances/:name/stop', validateAuthentication, new InstanceController().stop);

router.get('/instances/:name/logs', validateAuthentication, new InstanceController().logs);

// Servers
router.get('/servers', validateAuthentication, new ServerController().index);

router.post('/servers', validateAuthentication, new ServerController().create);

router.post('/servers/register', validateServerAuthentication, new ServerController().register);

router.put('/sync', validateServerAuthentication, new ServerController().sync);

// Images
router.get('/images', validateAuthentication, new ImageController().index);

router.get('/images/:image', validateAuthentication, new ImageController().details);

// Accounts
router.post('/accounts', validateAuthentication, new AccountController().create);

// Sessions
router.get('/sessions/:token', validateAuthentication, new SessionController().details);

router.post('/sessions', new SessionController().create);

// Jobs
router.get('/jobs', validateServerAuthentication, new JobController().index);

export default router;
