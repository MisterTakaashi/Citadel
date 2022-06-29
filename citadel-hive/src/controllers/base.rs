use std::io;

use redis::RedisError;
use rocket::{
    http::{ContentType, Status},
    response::{self, Responder},
    serde::{Deserialize, Serialize},
    Request, Response,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct ApiError {
    error: bool,
    message: String,
}

impl From<RedisError> for ApiError {
    fn from(_: RedisError) -> Self {
        ApiError {
            error: true,
            message: String::from("Unexpected redis error"),
        }
    }
}

impl<'r> Responder<'r, 'static> for ApiError {
    fn respond_to(self, _request: &'r Request<'_>) -> response::Result<'static> {
        let mut response = Response::new();
        response.set_header(ContentType::JSON);
        response.set_status(Status::InternalServerError);

        let resu = rocket::serde::json::to_string(&self).unwrap();

        response.set_sized_body(resu.len(), io::Cursor::new(resu));

        Ok(response)
    }
}
