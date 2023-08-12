import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { JobStatus, JobType, IJob } from 'citadel-lib';
import Server from './server';

class Job extends TimeStamps implements IJob {
  @prop({ required: true, type: String })
  public jobType: JobType;

  @prop({ required: true, type: String })
  public status = JobStatus.CREATED;

  @prop()
  public drone: Ref<Server>;

  @prop()
  public parameters: unknown;
}

const JobModel = getModelForClass(Job);

export default Job;
export { JobModel };
