#[macro_use]
extern crate rocket;
use rocket_db_pools::{deadpool_redis, Database};

mod controllers;
mod models;

#[derive(Database)]
#[database("redis_hive")]
struct HiveDatabase(deadpool_redis::Pool);

#[launch]
fn rocket() -> _ {
    println!("Hello, world!");

    let figment = rocket::Config::figment().merge((
        "databases.redis_hive",
        rocket_db_pools::Config {
            url: "redis://127.0.0.1".into(),
            min_connections: None,
            max_connections: 10,
            connect_timeout: 3,
            idle_timeout: None,
        },
    ));

    rocket::custom(figment)
        .attach(HiveDatabase::init())
        .attach(controllers::drone::routes())
}
