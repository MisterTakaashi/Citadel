import { Request, Response } from 'express';
import { JobStatus, renderError, renderSuccess } from '@citadelnest/lib';
import { JobModel } from '../models/job';
import { Promise as PromiseBB } from 'bluebird';
import Drone from '../models/drone';
import { JobCloseRequest } from './models/job';

class JobController {
  // GET /jobs
  async index(_: Request, res: Response) {
    renderSuccess(res, {
      jobs: await JobModel.find({}).sort({ createdAt: -1 }).populate('drone').limit(20),
    });
  }

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

  // PUT /jobs/:jobId/close
  async close(req: Request & { drone: Drone }, res: Response) {
    const { jobId } = req.params;
    const { status, reason } = req.body as JobCloseRequest;

    const job = await JobModel.findById(jobId);

    if (job === null) {
      renderError(res, 404, 'Cannot find job');
      return;
    }

    if (!Object.values(JobStatus).includes(status)) {
      renderError(res, 400, 'This job status does not exist');
      return;
    }

    job.status = status;
    job.reason = reason;

    await job.save();

    renderSuccess(res, {});
  }
}

export default JobController;
