import { commonControllers, InstanceVolume, JobStatus, JobType } from 'citadel-lib';
import { ServerModel } from '../models/server';
import { Context } from 'koa';
import { getImageConfig } from '../lib/config-query';
import { JobModel } from '../models/job';
import { InstanceModel } from '../models/instance';

interface InstanceCreateRequest {
  drone: string;
  image: string;
  name: string;
  config: any;
}

class InstanceController extends commonControllers.ApplicationController {
  // GET /instances
  async index(ctx: Context) {
    this.renderSuccess(ctx, {
      instances: await InstanceModel.find({}),
    });
  }

  // POST /instances
  async create(ctx: Context) {
    const { drone, image, name, config } = ctx.request.body as InstanceCreateRequest;
    const server = await ServerModel.findOne({ name: drone });
    if (!server) {
      this.renderError(ctx, 404, `Cannot find drone "${drone}"`);
      return;
    }

    const imageConfig = await getImageConfig(image);
    const volumes =
      config.volumes?.map((volume: InstanceVolume) => {
        const registeredPersistence = imageConfig.persistences.find((persistence) => persistence.name === volume.to);
        if (registeredPersistence) {
          volume.to = registeredPersistence.path;
        }

        return volume;
      }) || [];

    const job = new JobModel({
      jobType: JobType.CREATE_INSTANCE,
      status: JobStatus.CREATED,
      drone: server,
      parameters: {
        image: imageConfig.docker.image,
        name,
        config: { ...config, volumes },
      },
    });
    await job.save();

    this.renderSuccess(ctx, {
      job,
    });
  }

  // DELETE /instances/:name
  async remove(ctx: Context) {
    const { name } = ctx.params;

    const job = new JobModel({
      jobType: JobType.DELETE_INSTANCE,
      status: JobStatus.CREATED,
      parameters: {
        instance: name,
      },
    });
    await job.save();

    this.renderSuccess(ctx, job);
  }

  // GET /instances/:name
  async details(ctx: Context) {
    const { name } = ctx.params;

    const instance = await InstanceModel.findOne({ name }).populate('drone');

    if (!instance) {
      this.renderError(ctx, 404, `Cannot find instance "${name}"`);
      return;
    }

    this.renderSuccess(ctx, {
      instance,
    });
  }

  // POST /instances/:name/start
  async start(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const job = new JobModel({
      jobType: JobType.START_INSTANCE,
      status: JobStatus.CREATED,
      parameters: { instance: name },
    });
    await job.save();

    this.renderSuccess(ctx, job);
  }

  // POST /instances/:name/stop
  async stop(ctx: Context) {
    const { name } = ctx.params as { name: string };

    const { session } = ctx;

    const userDrones = await ServerModel.find({ owner: session.account });

    const instance = await InstanceModel.findOne({ name, drone: { $in: userDrones } });

    const job = new JobModel({
      jobType: JobType.STOP_INSTANCE,
      status: JobStatus.CREATED,
      parameters: { instance: name },
      drone: instance.drone,
    });

    await job.save();

    this.renderSuccess(ctx, job);
  }

  // GET /instances/:name/logs
  async logs(ctx: Context) {
    this.renderSuccess(ctx, { logs: [] });
  }
}

export default InstanceController;
