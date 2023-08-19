import Docker from 'dockerode';
import DockerProvider from '../providers/docker';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

export default async ({ instance }: { instance: string }) => {
  logger.info(`Stopping instance (${instance})...`);

  const provider = new DockerProvider(new Docker());
  try {
    await provider.stopInstance(instance);
  } catch (err) {
    logger.error(`Cannot stop instance: ${err.reason}`);
    return;
  }

  logger.info(`Instance (${instance}) stopped`);
};
