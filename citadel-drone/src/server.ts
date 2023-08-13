import dotenv from 'dotenv';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import PromiseBB from 'bluebird';
import makeLogger from './lib/logger';
import { connectToHive, pollNextJob } from './lib/hive';
import syncToHive from './lib/sync';

dotenv.config();

const logger = makeLogger(module);

(async () => {
  const { CITADEL_HIVE_HOST: envHost, CITADEL_HIVE_TOKEN: envToken } = process.env;

  const yargsBuilder = yargs(hideBin(process.argv))
    .option('host', {
      alias: 'h',
      type: 'string',
      description: 'The host url of the hive. Can also be provided with env variable "CITADEL_HIVE_HOST"',
    })
    .option('token', {
      alias: 't',
      type: 'string',
      description:
        'The authentication token to connect to the hive. Can also be provided with env variable "CITADEL_HIVE_TOKEN"',
    });

  if (!envHost) yargsBuilder.demandOption('host');
  if (!envToken) yargsBuilder.demandOption('token');

  const { host: argvHost, token: argvToken } = await yargsBuilder.parse();

  const host = argvHost ?? envHost;
  const token = argvToken ?? envToken;

  logger.info(`🐝 Launching the Drone...`);

  await connectToHive(host, token);

  logger.info(`🐝 Connected to Hive: ${host}.`);

  while (true) {
    await PromiseBB.delay(1000);
    await pollNextJob();
    await syncToHive();
  }
})();
