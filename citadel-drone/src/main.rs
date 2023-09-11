use clap::Parser;
use dotenv::dotenv;
use job::Volume;
use log::info;
use serde::{Deserialize, Serialize};
use std::{collections::HashMap, env};

mod executors;
mod hive;
mod job;
mod logger;
mod parser;
mod providers;
mod sync;

use crate::hive::Hive;

#[derive(Debug, Deserialize, Serialize)]
pub enum InstanceState {
    #[serde(rename = "created")]
    Created,
    #[serde(rename = "running")]
    Running,
    #[serde(rename = "exited")]
    Exited,
}
impl From<bollard::models::ContainerState> for InstanceState {
    fn from(value: bollard::models::ContainerState) -> Self {
        match value.status {
            Some(e) => match e {
                bollard::service::ContainerStateStatusEnum::CREATED => return Self::Created,
                bollard::service::ContainerStateStatusEnum::RUNNING => return Self::Running,
                bollard::service::ContainerStateStatusEnum::EXITED => return Self::Exited,
                _ => return Self::Exited,
            },
            None => return Self::Exited,
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct InstanceInfo {
    name: String,
    image: String,
    state: InstanceState,
    #[serde(rename = "portsMapping")]
    ports_mapping: HashMap<String, String>,
    #[serde(rename = "environmentVariables")]
    environment_variables: Vec<String>,
    volumes: Vec<Volume>,
}

#[tokio::main]
async fn main() {
    logger::init();
    let args = parser::Args::parse();

    dotenv().ok();

    let token = args
        .token
        .unwrap_or(env::var("CITADEL_HIVE_TOKEN").expect("Token is missing"));
    let url = args
        .url
        .unwrap_or(env::var("CITADEL_HIVE_URL").expect("Url is missing"));

    info!("🐝 Launching the Drone...");
    info!("Url: {}, Token: {}", url, token);

    let server = Hive::new(url, token);
    let restult2 = server.register().await;
    info!("{:?}", restult2);

    let provider = &providers::Provider::docker().unwrap();

    loop {
        server.fetch_jobs(provider).await;
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        let result = server.sync(provider).await;

        println!("{result:?}");
    }
}
