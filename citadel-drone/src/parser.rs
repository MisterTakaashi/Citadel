use clap::Parser;

#[derive(Parser, Debug)]
#[command(author, version, about)]
pub struct Args {
    #[arg(short, long)]
    pub url: Option<String>,
    #[arg(short, long)]
    pub token: Option<String>,
}
