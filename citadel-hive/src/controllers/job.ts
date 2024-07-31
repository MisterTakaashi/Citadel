import { Request, Response } from 'express';
import { JobStatus, renderSuccess } from '@citadelnest/lib';
import { JobModel } from '../models/job';
import { Promise as PromiseBB } from 'bluebird';
import Drone from '../models/drone';

class JobController {
  // GET /drone/jobs !!WARNING this endpoint is a long poll endpoint!!
  async drone(req: Request & { drone: Drone }, res: Response) {
    const { drone } = req;

    const MAX_RETRIES = 10;
    const lookForJob = async (retry = 0) => {
      if (retry >= MAX_RETRIES) return null;

      const job = await JobModel.findOne({ status: JobStatus.CREATED, drone: drone });

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
