use log::info;

use crate::{job, providers::ProviderImpl};

use super::error::ExecutorError;

pub async fn instance_create(
    provider: &impl ProviderImpl,
    parameters: &job::InstanceCreateJobParameters,
) -> Result<(), ExecutorError> {
    info!("Creating instance");

    let job::InstanceCreateJobParameters { config, image } = parameters;

    let instance_name = provider.create_instance(image.clone(), config).await?;

    provider.start_instance(instance_name.as_str()).await?;

    info!("Instance `{}` created and started", &instance_name);

    Ok(())
}
pub async fn instance_delete(
    provider: &impl ProviderImpl,
    parameters: &job::InstanceDeleteJobParameters,
) -> Result<(), ExecutorError> {
    info!("Deleting instance");

    let job::InstanceDeleteJobParameters {
        instance: instance_name,
    } = parameters;

    provider.remove_instance(instance_name).await?;

    Ok(())
}
pub async fn instance_start(
    provider: &impl ProviderImpl,
    parameters: &job::InstanceStartJobParameters,
) -> Result<(), ExecutorError> {
    info!("Starting instance");

    let job::InstanceStartJobParameters {
        instance: instance_name,
    } = parameters;

    provider.start_instance(instance_name).await?;

    Ok(())
}
pub async fn instance_stop(
    provider: &impl ProviderImpl,
    parameters: &job::InstanceStopJobParameters,
) -> Result<(), ExecutorError> {
    info!("Stopping instance");

    let job::InstanceStopJobParameters {
        instance: instance_name,
    } = parameters;

    provider.stop_instance(instance_name).await?;

    Ok(())
}
