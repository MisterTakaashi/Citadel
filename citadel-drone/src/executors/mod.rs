use error::ExecutorError;

use crate::{job, providers};

use self::instance::{instance_create, instance_delete, instance_start, instance_stop};

mod error;
mod instance;

pub async fn dispatch(
    job: &job::Job,
    provider: &impl providers::ProviderImpl,
) -> Result<(), ExecutorError> {
    match job.job_type {
        job::JobType::CreateInstance => {
            instance_create(
                provider,
                &job.from_value::<job::InstanceCreateJobParameters>(),
            )
            .await
        }
        job::JobType::DeleteInstance => {
            instance_delete(
                provider,
                &job.from_value::<job::InstanceDeleteJobParameters>(),
            )
            .await
        }
        job::JobType::StartInstance => {
            instance_start(
                provider,
                &job.from_value::<job::InstanceStartJobParameters>(),
            )
            .await
        }
        job::JobType::StopInstance => {
            instance_stop(
                provider,
                &job.from_value::<job::InstanceStopJobParameters>(),
            )
            .await
        }
    }
}
