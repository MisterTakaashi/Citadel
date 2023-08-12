import Docker from 'dockerode';
import DockerProvider from '../providers/docker';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

export default async ({ name }: { name: string }) => {
  logger.info(`Deleting instance (${name})...`);

  const provider = new DockerProvider(new Docker());
  try {
    await provider.removeInstance(name);
  } catch (err) {
    if (err.statusCode === 409) {
      logger.error('Cannot remove a running container');
      return;
    }
    logger.error(`Cannot remove instance: ${err.message}`);
    return;
  }

  logger.info(`Instance (${name}) deleted`);
};
