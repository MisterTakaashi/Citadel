import { Router } from 'express';

import DroneController from './controllers/drone';
import InstanceController from './controllers/instance';
import ImageController from './controllers/image';
import AccountController from './controllers/account';
import SessionController from './controllers/session';
import JobController from './controllers/job';
import { validateAuthentication, validateDroneAuthentication } from './lib/auth-middleware';

const router = Router();

// Instances
router.get('/instances', validateAuthentication, new InstanceController().index);

router.post('/instances', validateAuthentication, new InstanceController().create);

router.get('/instances/:name', validateAuthentication, new InstanceController().details);

router.delete('/instances/:name', validateAuthentication, new InstanceController().remove);

router.post('/instances/:name/start', validateAuthentication, new InstanceController().start);

router.post('/instances/:name/stop', validateAuthentication, new InstanceController().stop);

router.get('/instances/:name/logs', validateAuthentication, new InstanceController().logs);

// Drones
router.get('/drones', validateAuthentication, new DroneController().index);

router.get('/drones/:name', validateAuthentication, new DroneController().show);

router.get('/drone', validateDroneAuthentication, new DroneController().connected);

router.post('/drones', validateAuthentication, new DroneController().create);

router.post('/drones/register', validateDroneAuthentication, new DroneController().register);

router.put('/sync', validateDroneAuthentication, new DroneController().sync);

// Images
router.get('/images', validateAuthentication, new ImageController().index);

router.get('/images/:image', validateAuthentication, new ImageController().details);

// Accounts
router.post('/accounts', validateAuthentication, new AccountController().create);

// Sessions
router.get('/sessions/:token', validateAuthentication, new SessionController().details);

router.post('/sessions', new SessionController().create);

// Jobs
router.get('/jobs', validateDroneAuthentication, new JobController().index);

export default router;
