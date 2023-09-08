import { createClient } from 'redis';
import makeLogger from './logger';

const logger = makeLogger(module);

const client = createClient();
client.on('error', (err) => logger.error(`Redis Client Error (${err})`));

const initRedis = async () => {
  await client.connect();
};

const getRedisClient = async () => client;

export { initRedis, getRedisClient };
