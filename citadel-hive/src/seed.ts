import { connect } from 'mongoose';
import Account, { AccountModel } from './models/account';
import { DroneModel } from './models/drone';
import { config } from 'dotenv';
import makeLogger from './lib/logger';

const logger = makeLogger(module);

(async () => {
  const env = process.env.NODE_ENV || 'development';

  logger.info(`Seeding for ${env} environment...`);

  config();
  await connect(`mongodb://localhost:27017/citadel_${env}`);
  const user = await AccountModel.create({
    email: 'dev@citadel.io',
    password: Account.hashPassword(Account.saltPassword('password')),
  });
  await DroneModel.create({
    name: 'belligerent wasp',
    owner: user,
    token: '01H7G0A9JK6P5430N8PBTEJ9PH',
    publicIp: '::1',
    selfHosted: true,
  });

  logger.info(`Seeding Done.`);
  process.exit(0);
})();
