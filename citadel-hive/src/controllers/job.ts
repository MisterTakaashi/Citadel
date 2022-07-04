import { commonControllers } from 'citadel-lib';
import { Context } from 'koa';
import { JobModel } from '../models/job';

class JobController extends commonControllers.ApplicationController {
  // GET /jobs
  async index(ctx: Context) {
    const jobs = await JobModel.find({});

    this.renderSuccess(ctx, {
      jobs,
    });
  }
}

export default JobController;
