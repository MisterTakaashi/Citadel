use futures_util::{stream::StreamExt, TryStreamExt};
use std::{collections::HashMap, fs, path::Path};

use async_trait::async_trait;
use bollard::Docker;

use crate::{
    job::{self, Volume},
    InstanceInfo, InstanceState,
};

use super::{ProviderError, ProviderImpl};

pub struct DockerProvider {
    pub(super) docker: Docker,
}

#[async_trait]
impl ProviderImpl for DockerProvider {
    async fn get_instances(&self) -> Result<Vec<InstanceInfo>, ProviderError> {
        let containers = self
            .docker
            .list_containers(Some(bollard::container::ListContainersOptions::<&str> {
                all: true,
                ..Default::default()
            }))
            .await?;

        let mut citadel_containers: Vec<bollard::models::ContainerSummary> = vec![];
        for container in containers {
            if container.names.to_owned().unwrap()[0].starts_with("/citadel_") {
                citadel_containers.push(container);
            }
        }

        let mut instances: Vec<InstanceInfo> = vec![];
        for container in citadel_containers {
            let instance = self.get_instance(&container.names.unwrap()[0][1..]).await?;

            if instance.is_none() {
                return Err(ProviderError::ContainerNotFound);
            }

            instances.push(instance.unwrap());
        }

        Ok(instances)
    }
    async fn get_instance(
        &self,
        instance_name: &str,
    ) -> Result<Option<InstanceInfo>, ProviderError> {
        println!("Asking for!!!! {}", instance_name);

        let container_result = self.docker.inspect_container(instance_name, None).await;

        let container_inspect = match container_result {
            Err(e) => match e {
                bollard::errors::Error::DockerResponseServerError { status_code, .. }
                    if status_code == 404 =>
                {
                    return Ok(None);
                }
                e => return Err(ProviderError::DockerError(e)),
            },
            Ok(container) => container,
        };

        let host_config = container_inspect.host_config.unwrap();

        let mut ports_binding: HashMap<String, String> = HashMap::new();
        for (container_port, bindings) in host_config.port_bindings.unwrap() {
            for binding in bindings.unwrap() {
                ports_binding.insert(container_port.clone(), binding.host_port.unwrap());
            }
        }

        let image_sha = container_inspect.image.unwrap();
        let image = self.docker.list_images::<String>(None).await.unwrap().iter().find(|image| image.id == image_sha).unwrap().clone();

        Ok(Some(InstanceInfo {
            name: instance_name.to_owned(),
            // TODO: find the image name with docker instead of sha1 hash
            image: image.repo_tags.first().unwrap().to_owned(),
            state: InstanceState::from(container_inspect.state.unwrap()),
            volumes: host_config
                .binds
                .unwrap_or(vec![])
                .iter()
                .map(|bind| {
                    // TODO: Rewrite the unwrapping here
                    let mut splitted_bind = bind.split(":");
                    let from = splitted_bind.next().unwrap().to_owned();
                    let to = splitted_bind.next().unwrap().to_owned();

                    let is_directory = fs::metadata(&from).unwrap().is_dir();

                    Volume {
                        from,
                        to,
                        file: !is_directory,
                    }
                })
                .collect(),
            ports_mapping: ports_binding,
            environment_variables: container_inspect.config.unwrap().env.unwrap(),
        }))
    }
    async fn start_instance(&self, instance_name: &str) -> Result<(), ProviderError> {
        let result = self
            .docker
            .start_container::<&str>(instance_name, None)
            .await?;

        Ok(result)
    }
    async fn stop_instance(&self, instance_name: &str) -> Result<(), ProviderError> {
        self.docker.stop_container(instance_name, None).await?;

        Ok(())
    }
    async fn create_instance(
        &self,
        image: String,
        config: &job::JobParametersConfig,
    ) -> Result<String, ProviderError> {
        let container_name = format!(
            "citadel_{}",
            image
                .split('/')
                .next_back()
                .unwrap_or(image.as_str())
                .split(":")
                .next()
                .unwrap_or("default_name")
                .replace("-", "_")
                .replace("citadel_", "")
        );

        for volume in &config.volumes {
            let from_path = Path::new(volume.from.as_str());
            if from_path == Path::new("") {
                continue;
            }
            println!("{from_path:?}");

            if !volume.file {
                fs::create_dir_all(&from_path)?;
            } else {
                fs::create_dir_all(&from_path.parent().unwrap_or(from_path))?;
                fs::OpenOptions::new()
                    .write(true)
                    .append(true)
                    .create(true)
                    .open(from_path)?;
            }
        }

        // TODO: Rework the user uid
        // user.uid = user.uid === -1 ? 1000 : user.uid;
        // user.gid = user.gid === -1 ? 1000 : user.gid;

        let mut port_bindings = HashMap::new();
        for port_binding in &config.ports_mapping {
            port_bindings.insert(
                port_binding.0.to_string(),
                Some(vec![bollard::models::PortBinding {
                    host_port: Some(port_binding.1.to_string()),
                    ..Default::default()
                }]),
            );
        }

        let env = config.environment_variables.clone().unwrap_or(HashMap::new());

        self.docker
            .create_container::<String, String>(
                Some(bollard::container::CreateContainerOptions {
                    name: container_name.clone(),
                    ..Default::default()
                }),
                bollard::container::Config {
                    image: Some(image),
                    tty: Some(true),
                    host_config: Some(bollard::models::HostConfig {
                        cpu_quota: Some(config.resources.cpu as i64 * 100000),
                        memory: Some(config.resources.ram as i64 * 1000000000),
                        port_bindings: Some(port_bindings),
                        binds: Some(
                            config
                                .volumes
                                .iter()
                                .filter(|volume| volume.from != "")
                                .map(|volume| format!("{}:{}", volume.from, volume.to))
                                .collect(),
                        ),
                        ..Default::default()
                    }),
                    env: Some(
                        env
                            .iter()
                            .map(|env_var| format!("{}={}", env_var.0, env_var.1))
                            .collect(),
                    ),
                    ..Default::default()
                },
            )
            .await?;

        Ok(container_name)
    }
    async fn remove_instance(&self, instance_name: &str) -> Result<(), ProviderError> {
        self.docker.remove_container(instance_name, None).await?;

        Ok(())
    }
    fn fetch_binaries(&self) -> () {
        unimplemented!()
    }
    async fn get_logs(&self, instance_name: &str, since: i64) -> Result<Vec<String>, ProviderError> {
        // TODO: eruk, remove the unwrap
        let stream = self
            .docker
            .logs(
                instance_name,
                Some(bollard::container::LogsOptions::<&str> {
                    since,
                    stdout: true,
                    ..Default::default()
                }),
            )
            .try_collect::<Vec<_>>()
            .await?;

        Ok(stream.iter().map(|f| format!("{f}")).collect())
    }
}
