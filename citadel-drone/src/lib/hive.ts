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
  const { status, data: apiResponse } = await axios.get<{ data: { jobs: IJob[] } }>(`${host}/jobs`, {
    headers: { 'X-Api-Key': token },
  });

  if (status === 201) return;
  if (apiResponse.data?.jobs !== undefined && apiResponse.data.jobs.length <= 0) return;

  const job = apiResponse.data.jobs[0];

  logger.info(`New job polled (${job.jobType}) (${job.status})`);

  dispatcher(job);
};

export { connectToHive, pollNextJob };
