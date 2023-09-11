pub fn init() {
    let logger_configuration = env_logger::Env::default().filter_or("LOG_LEVEL", "info");

    env_logger::init_from_env(logger_configuration);
}
