use redis::AsyncCommands;
use rocket::{fairing::AdHoc, serde::json::Json};
use rocket_db_pools::Connection;

use crate::{models::drone::Drone, HiveDatabase};

use super::base::ApiError;

#[get("/")]
async fn servers(mut db: Connection<HiveDatabase>) -> Result<Json<Vec<Drone>>, ApiError> {
    let drones = db
        .zrange::<&str, Vec<String>>("citadel:drones:all:index", 0, -1)
        .await?;

    let real_drones = drones
        .iter()
        .map(|x| Drone {
            name: x.clone(),
            self_hosted: true,
        })
        .collect::<Vec<Drone>>();

        for drone in drones {
            println!("mdr");
            let res = db.hget::<String, &str, String>(format!("citadel:drones:{}", drone), "name").await?;
            println!("{:?}", res);
        }

    Ok(Json(real_drones))
}

pub fn routes() -> AdHoc {
    AdHoc::on_ignite("Server Routes", |rocket| async {
        rocket.mount("/servers", routes![servers])
    })
}
