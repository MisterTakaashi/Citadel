import Docker from 'dockerode';
import DockerProvider from '../providers/docker';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

export default async ({ name }: { name: string }) => {
  logger.info(`Starting instance (${name})...`);

  const provider = new DockerProvider(new Docker());
  try {
    await provider.startInstance(name);
  } catch (err) {
    logger.error(`Cannot start instance: ${err.reason}`);
    return;
  }

  logger.info(`Instance (${name}) started`);
};
