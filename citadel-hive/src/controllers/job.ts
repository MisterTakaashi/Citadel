import { Request, Response } from 'express';
import { JobStatus, renderSuccess } from 'citadel-lib';
import { JobModel } from '../models/job';
import { Promise as PromiseBB } from 'bluebird';
import Server from '../models/server';

class JobController {
  // TODO: this should not be the GET endpoint for /jobs, it should return all the jobs just as an information
  // We should add an expoint explicitly for the drone to query
  // GET /jobs !!WARNING this endpoint is a long poll endpoint!!
  async index(req: Request & { server: Server }, res: Response) {
    const { server } = req;

    const MAX_RETRIES = 10;
    const lookForJob = async (retry = 0) => {
      if (retry >= MAX_RETRIES) return null;

      const job = await JobModel.findOne({ status: JobStatus.CREATED, drone: server });

      if (!job) {
        await PromiseBB.delay(1000);
        return lookForJob(retry + 1);
      }

      job.status = JobStatus.DELIVERED;
      await job.save();

      return job;
    };

    const job = await lookForJob();

    renderSuccess(res, {
      job,
    });
  }
}

export default JobController;
