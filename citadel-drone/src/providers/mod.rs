use async_trait::async_trait;
use bollard::Docker;

use crate::{job, InstanceInfo};

use self::docker::DockerProvider;

mod docker;

pub struct Provider;
impl Provider {
    pub fn docker() -> Result<DockerProvider, bollard::errors::Error> {
        Ok(DockerProvider {
            docker: Docker::connect_with_socket_defaults()?,
        })
    }
}

#[derive(Debug)]
pub enum ProviderError {
    IoError(std::io::Error),
    DockerError(bollard::errors::Error),
    ContainerNotFound,
}

impl From<std::io::Error> for ProviderError {
    fn from(value: std::io::Error) -> Self {
        Self::IoError(value)
    }
}

impl From<bollard::errors::Error> for ProviderError {
    fn from(value: bollard::errors::Error) -> Self {
        Self::DockerError(value)
    }
}

#[async_trait]
pub trait ProviderImpl {
    async fn get_instances(&self) -> Result<Vec<InstanceInfo>, ProviderError>;
    async fn get_instance(&self, instance_name: &str) -> Result<Option<InstanceInfo>, ProviderError>;
    async fn start_instance(&self, instance_name: &str) -> Result<(), ProviderError>;
    async fn stop_instance(&self, instance_name: &str) -> Result<(), ProviderError>;
    async fn create_instance(
        &self,
        image: String,
        config: &job::JobParametersConfig,
    ) -> Result<String, ProviderError>;
    async fn remove_instance(&self, instance_name: &str) -> Result<(), ProviderError>;
    fn fetch_binaries(&self) -> ();
    async fn get_logs(&self, instance_name: &str, since: i64) -> Result<Vec<String>, ProviderError>;
}
