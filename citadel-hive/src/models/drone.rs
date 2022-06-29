use rocket::serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Drone {
    pub name: String,
    pub self_hosted: bool,
}
