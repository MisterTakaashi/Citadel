use std::collections::HashMap;

use serde::{Deserialize, Serialize, de::DeserializeOwned};

use crate::{executors, providers};

#[derive(Debug, Deserialize)]
pub enum JobStatus {
    #[serde(rename = "created")]
    CREATED,
    #[serde(rename = "delivered")]
    DELIVERED,
}

#[derive(Debug, Deserialize)]
pub enum JobType {
    #[serde(rename = "create_instance")]
    CreateInstance,
    #[serde(rename = "delete_instance")]
    DeleteInstance,
    #[serde(rename = "start_instance")]
    StartInstance,
    #[serde(rename = "stop_instance")]
    StopInstance,
}

#[derive(Debug, Deserialize)]
pub struct Resources {
    pub cpu: u8,
    pub ram: u8,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Volume {
    pub to: String,
    pub from: String,
    pub file: bool,
}

#[derive(Debug, Deserialize)]
pub struct JobParametersConfig {
    #[serde(rename = "portsMapping")]
    pub ports_mapping: HashMap<String, String>,
    pub volumes: Vec<Volume>,
    #[serde(rename = "environmentVariables")]
    pub environment_variables: Option<HashMap<String, String>>,
    pub resources: Resources,
}

#[derive(Debug, Deserialize)]
pub struct InstanceCreateJobParameters {
    pub image: String,
    pub config: JobParametersConfig,
}

#[derive(Debug, Deserialize)]
pub struct InstanceStartJobParameters {
    pub instance: String,
}

#[derive(Debug, Deserialize)]
pub struct InstanceStopJobParameters {
    pub instance: String,
}

#[derive(Debug, Deserialize)]
pub struct InstanceDeleteJobParameters {
    pub instance: String,
}

#[derive(Debug, Deserialize)]
pub struct JobParameters {
    pub value: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct Job {
    #[serde(rename = "jobType")]
    pub job_type: JobType,
    pub status: JobStatus,
    pub parameters: serde_json::Value,
}
impl Job {
    pub fn from_value<T>(&self) -> T where T: DeserializeOwned {
        serde_json::from_value(self.parameters.clone()).unwrap()
    }
}

impl Job {
    pub async fn execute(&self, provider: &impl providers::ProviderImpl) {
        executors::dispatch(&self, provider).await;
    }
}
