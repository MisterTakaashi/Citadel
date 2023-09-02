import Docker from 'dockerode';
import DockerProvider from '../providers/docker';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

interface InstanceStartParams {
  instance: string;
}

export default async ({ instance }: InstanceStartParams) => {
  logger.info(`Starting instance (${instance})...`);

  const provider = new DockerProvider(new Docker());
  try {
    await provider.startInstance(instance);
  } catch (err) {
    logger.error(`Cannot start instance: ${err.reason}`);
    return;
  }

  logger.info(`Instance (${instance}) started`);
};
