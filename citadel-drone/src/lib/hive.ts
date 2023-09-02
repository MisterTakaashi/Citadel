import makeLogger from './logger';
import { IJob } from '@citadelnest/lib';
import dispatcher from '../dispatcher';

const logger = makeLogger(module);

let HOST: string, TOKEN: string;

const queryHive = async <T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'GET' | 'PATCH' | 'DELETE',
  data?: unknown
): Promise<T> => {
  const response = await fetch(new URL(endpoint, HOST), {
    headers: { 'content-type': 'application/json;charset=UTF-8', 'X-Api-Key': TOKEN },
    method,
    body: JSON.stringify(data),
  });

  if (response.ok) return { ...(await response.json()), status: response.status };

  if (response.status < 500) throw new Error((await response.json()).message);

  throw new Error('Unhandled error from hive');
};

const connectToHive = async (host: string, token: string) => {
  try {
    HOST = host;
    TOKEN = token;
    await queryHive('/drones/register', 'POST', {});
  } catch (e) {
    throw new Error(`Cannot connect to the hive (${e.cause ?? e.message})`);
  }
};

const pollNextJob = async () => {
  const { status, data } = await queryHive<{ status: number; data: { job: IJob } }>('/jobs', 'GET');

  if (status === 201) return;
  if (data?.job === undefined || data.job === null) return;

  const { job } = data;

  logger.info(`New job polled (${job.jobType}) (${job.status})`);

  dispatcher(job);
};

const tryPollNextJob = async () => {
  try {
    await pollNextJob();
  } catch (e) {
    logger.error(`Error while polling next job: ${e}`);
  }
};

export { connectToHive, pollNextJob, tryPollNextJob, queryHive };
