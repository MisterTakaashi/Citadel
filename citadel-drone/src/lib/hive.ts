import axios from 'axios';
import makeLogger from './logger';
import { IJob } from '@citadelnest/lib';
import dispatcher from '../dispatcher';

const logger = makeLogger(module);

let HOST: string, TOKEN: string;

const queryHive = async <T>(endpoint: string, method: 'POST' | 'PUT' | 'GET' | 'PATCH' | 'DELETE', data?: unknown) => {
  return axios<T>({
    baseURL: HOST,
    headers: { 'X-Api-Key': TOKEN },
    url: endpoint,
    method,
    data,
  });
};

const connectToHive = async (host: string, token: string) => {
  try {
    await axios.post(`${host}/drones/register`, {}, { headers: { 'X-Api-Key': token } });
    HOST = host;
    TOKEN = token;
  } catch (e) {
    throw new Error(`Cannot connect to the hive (${e.response.data.message})`);
  }
};

const pollNextJob = async () => {
  const { status, data: apiResponse } = await queryHive<{ data: { job: IJob } }>('/jobs', 'GET');

  if (status === 201) return;
  if (apiResponse.data?.job === undefined || apiResponse.data.job === null) return;

  const { job } = apiResponse.data;

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
