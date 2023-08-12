import { JobStatus, commonControllers } from 'citadel-lib';
import { Context } from 'koa';
import { JobModel } from '../models/job';

class JobController extends commonControllers.ApplicationController {
  // GET /jobs
  async index(ctx: Context) {
    const { server } = ctx;

    const jobs = await JobModel.find({ status: JobStatus.CREATED, drone: server });

    this.renderSuccess(ctx, {
      jobs,
    });
  }
}

export default JobController;
