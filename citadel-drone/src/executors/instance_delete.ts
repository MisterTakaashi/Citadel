import Docker from 'dockerode';
import DockerProvider from '../providers/docker';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

interface InstanceDeleteParams {
  instance: string;
}

export default async ({ instance }: InstanceDeleteParams) => {
  logger.info(`Deleting instance (${instance})...`);

  const provider = new DockerProvider(new Docker());
  try {
    await provider.removeInstance(instance);
  } catch (err) {
    if (err.statusCode === 409) {
      logger.error('Cannot remove a running container');
      return;
    }
    logger.error(`Cannot remove instance: ${err.message}`);
    return;
  }

  logger.info(`Instance (${instance}) deleted`);
};
