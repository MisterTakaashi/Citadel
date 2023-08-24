import Docker from 'dockerode';
import { SyncMessage } from '@citadelnest/lib';
import DockerProvider from '../providers/docker';
import { queryHive } from './hive';
import makeLogger from './logger';

const logger = makeLogger(module);

const syncToHive = async () => {
  const provider = new DockerProvider(new Docker());

  const instances = await provider.getInstances();

  const message: SyncMessage = { instances };
  console.log('message', message);
  await queryHive('/sync', 'PUT', message);
};

const trySyncToHive = async () => {
  try {
    await syncToHive();
  } catch (e) {
    logger.error(`Error while syncing to the hive: ${e}`);
  }
};

export { syncToHive, trySyncToHive };
