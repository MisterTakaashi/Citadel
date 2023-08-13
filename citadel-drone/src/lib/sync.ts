import Docker from 'dockerode';
import { SyncMessage } from 'citadel-lib';
import DockerProvider from '../providers/docker';
import { queryHive } from './hive';

const syncToHive = async () => {
  const provider = new DockerProvider(new Docker());

  const instances = await provider.getInstances();

  const message: SyncMessage = { instances };
  console.log('message', message);
  await queryHive('/sync', 'PUT', message);
};

export default syncToHive;
