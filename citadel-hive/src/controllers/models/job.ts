import { JobStatus } from '@citadelnest/lib';

interface JobCloseRequest {
  status: JobStatus;
  reason: string;
}

export { JobCloseRequest };
