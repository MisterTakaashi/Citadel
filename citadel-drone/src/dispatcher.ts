import { IJob, JobType } from '@citadel/lib';
import instanceCreate from './executors/instance_create';
import instanceDelete from './executors/instance_delete';
import instanceStart from './executors/instance_start';
import instanceStop from './executors/instance_stop';

const executors = {
  [JobType.CREATE_INSTANCE]: instanceCreate,
  [JobType.DELETE_INSTANCE]: instanceDelete,
  [JobType.START_INSTANCE]: instanceStart,
  [JobType.STOP_INSTANCE]: instanceStop,
};

const dispatcher = async (job: IJob) => {
  const executor = executors[job.jobType];

  await executor(job.parameters as any);
};

export default dispatcher;
