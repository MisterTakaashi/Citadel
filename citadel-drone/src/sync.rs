use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use time::OffsetDateTime;

use crate::{
    hive::{self, Hive},
    providers, InstanceInfo,
};

#[derive(Debug, Deserialize, Serialize)]
struct SyncBody {
    instances: Vec<InstanceInfo>,
    #[serde(rename = "instancesLogs")]
    instances_logs: HashMap<String, Vec<String>>,
}

#[derive(Debug, Deserialize)]
struct DroneInfoResponseDrone {
    pub name: String,
    #[serde(
        rename = "lastSync",
        with = "time::serde::iso8601::option",
        default = "DroneInfoResponseDrone::default_last_sync"
    )]
    pub last_sync: Option<OffsetDateTime>,
}
impl DroneInfoResponseDrone {
    fn default_last_sync() -> Option<OffsetDateTime> {
        None
    }
}

#[derive(Debug, Deserialize)]
struct DroneInfoResponse {
    pub drone: DroneInfoResponseDrone,
}

#[derive(Debug)]
pub enum SyncError {
    ProviderError(providers::ProviderError),
    HiveError(hive::HiveError),
}
impl From<providers::ProviderError> for SyncError {
    fn from(value: providers::ProviderError) -> Self {
        Self::ProviderError(value)
    }
}
impl From<hive::HiveError> for SyncError {
    fn from(value: hive::HiveError) -> Self {
        Self::HiveError(value)
    }
}

impl Hive {
    pub async fn sync(provider: &impl providers::ProviderImpl) -> Result<(), SyncError> {
        let instances = provider.get_instances().await?;

        let result =
            Hive::query::<DroneInfoResponse, ()>("/drone", reqwest::Method::GET, None).await?;

        let mut instances_logs = HashMap::new();

        for instance in &instances {
            instances_logs.insert(
                instance.name.clone(),
                provider
                    .get_logs(
                        instance.name.as_str(),
                        result
                            .data
                            .drone
                            .last_sync
                            .unwrap_or(OffsetDateTime::now_utc())
                            .unix_timestamp(),
                    )
                    .await?,
            );
        }

        let body = SyncBody {
            instances,
            instances_logs,
        };

        println!("{body:#?}");

        Hive::query::<HashMap<(), ()>, SyncBody>("/sync", reqwest::Method::PUT, Some(&body))
            .await?;

        Ok(())
    }
}
