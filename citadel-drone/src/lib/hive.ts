import axios from 'axios';
import makeLogger from './logger';
import { IJob } from 'citadel-lib';
import dispatcher from '../dispatcher';

const logger = makeLogger(module);

const connectToHive = async (host: string, token: string) => {
  try {
    await axios.post(`${host}/servers/register`, {}, { headers: { 'X-Api-Key': token } });
  } catch (e) {
    throw new Error(`Cannot connect to the hive (${e.response.data.message})`);
  }
};

const pollNextJob = async (host: string, token: string) => {
  const { status, data: apiResponse } = await axios.get<{ data: { job: IJob } }>(`${host}/jobs`, {
    headers: { 'X-Api-Key': token },
  });

  if (status === 201) return;
  if (apiResponse.data?.job === undefined || apiResponse.data.job === null) return;

  const { job } = apiResponse.data;

  logger.info(`New job polled (${job.jobType}) (${job.status})`);

  dispatcher(job);
};

export { connectToHive, pollNextJob };
