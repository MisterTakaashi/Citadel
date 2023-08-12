enum JobType {
  CREATE_INSTANCE = "create_instance",
  START_INSTANCE = "start_instance",
  STOP_INSTANCE = "stop_instance",
  DELETE_INSTANCE = "delete_instance",
}

enum JobStatus {
  CREATED = "created",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  FAILED = "failed",
}

interface IJob {
  jobType: JobType;
  status: JobStatus;
  parameters: unknown;
}

export { JobType, JobStatus, IJob };
