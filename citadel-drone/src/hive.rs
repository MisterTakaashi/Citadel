use log::info;
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use crate::{job, providers};

pub struct Hive {
    url: String,
    token: String,
}

#[derive(Debug)]
pub enum HiveError {
    ReqwestError(reqwest::Error),
    SerdeError(serde_json::Error),
}

impl From<reqwest::Error> for HiveError {
    fn from(value: reqwest::Error) -> Self {
        Self::ReqwestError(value)
    }
}

impl From<serde_json::Error> for HiveError {
    fn from(value: serde_json::Error) -> Self {
        Self::SerdeError(value)
    }
}

#[derive(Debug, Deserialize)]
pub struct HiveResponse<T> {
    pub error: bool,
    pub data: T,
}

#[derive(Debug, Deserialize)]
pub struct DroneRegisterResponseDrone {
    name: String,
}

#[derive(Debug, Deserialize)]
pub struct DroneRegisterResponse {
    drone: DroneRegisterResponseDrone,
}

#[derive(Debug, Deserialize)]
pub struct JobResponse {
    job: Option<job::Job>,
}

impl Hive {
    pub fn new(url: String, token: String) -> Self {
        Self { url, token }
    }

    async fn build_client(&self) -> Result<reqwest::Client, HiveError> {
        let mut headers = reqwest::header::HeaderMap::new();
        headers.insert(
            reqwest::header::CONTENT_TYPE,
            reqwest::header::HeaderValue::from_static("application/json;charset=UTF-8"),
        );

        headers.insert(
            "X-Api-Key",
            reqwest::header::HeaderValue::from_str(self.token.as_str()).unwrap(),
        );

        let client_builder = reqwest::Client::builder();
        let client = client_builder.default_headers(headers).build()?;

        Ok(client)
    }

    pub async fn query<T, B>(
        &self,
        endpoint: &str,
        method: reqwest::Method,
        body: Option<&B>,
    ) -> Result<HiveResponse<T>, HiveError>
    where
        T: DeserializeOwned,
        B: Serialize,
    {
        let client = self.build_client().await?;

        let mut request = client.request(method, format!("{}{}", self.url, endpoint));

        if body.is_some() {
            request = request.json::<B>(&body.unwrap());
        }

        /* let request2 = request.try_clone().unwrap().send().await?.text().await;
        println!("{request2:?}"); */

        let result = request.send().await?;

        Ok(result.json::<HiveResponse<T>>().await?)
    }

    pub async fn register(&self) -> Result<HiveResponse<DroneRegisterResponse>, HiveError> {
        self.query::<DroneRegisterResponse, ()>("/drones/register", reqwest::Method::POST, None)
            .await
    }

    pub async fn fetch_jobs(&self, provider: &impl providers::ProviderImpl) -> () {
        let job = self
            .query::<JobResponse, ()>("/jobs", reqwest::Method::GET, None)
            .await;

        if job.is_err() {
            info!("{job:?}");

            return;
        }

        let unwrapped_job_option = job.unwrap();

        if unwrapped_job_option.data.job.is_none() {
            return;
        }

        unwrapped_job_option
            .data
            .job
            .unwrap()
            .execute(provider)
            .await;
    }
}
