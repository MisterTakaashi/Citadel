use log::info;

use crate::{job, providers::ProviderImpl};

pub async fn instance_create(provider: &impl ProviderImpl, parameters: &job::InstanceCreateJobParameters) {
    info!("Creating instance");

    let job::InstanceCreateJobParameters { config, image } = parameters;

    let instance_name = provider
        .create_instance(image.clone(), config)
        .await
        .expect("Cannot create server");

    provider.start_instance(instance_name.as_str()).await.expect("Cannot start the server");

    info!("Instance `{}` created and started", &instance_name);
}
pub async fn instance_delete(provider: &impl ProviderImpl, parameters: &job::InstanceDeleteJobParameters) {
    info!("Deleting instance");

    let job::InstanceDeleteJobParameters { instance: instance_name } = parameters;

    provider.remove_instance(instance_name).await.expect("Cannot delete instance");
}
pub async fn instance_start(provider: &impl ProviderImpl, parameters: &job::InstanceStartJobParameters) {
    info!("Starting instance");

    let job::InstanceStartJobParameters { instance: instance_name } = parameters;

    provider.start_instance(instance_name).await.expect("Cannot start the server");
}
pub async fn instance_stop(provider: &impl ProviderImpl, parameters: &job::InstanceStopJobParameters) {
    info!("Stopping instance");

    let job::InstanceStopJobParameters { instance: instance_name } = parameters;

    provider.stop_instance(instance_name).await.expect("Cannot stop the server");
}
