use crate::providers::ProviderError;

#[derive(Debug)]
pub enum ExecutorError {
    ProviderError(ProviderError),
}

impl From<ProviderError> for ExecutorError {
    fn from(value: ProviderError) -> Self {
        Self::ProviderError(value)
    }
}
