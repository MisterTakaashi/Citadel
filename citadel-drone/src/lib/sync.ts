import Docker from 'dockerode';
import { SyncMessage } from '@citadelnest/lib';
import PromiseBB from 'bluebird';
import DockerProvider from '../providers/docker';
import { queryHive } from './hive';
import makeLogger from './logger';

const logger = makeLogger(module);

interface DroneInfo {
  drone: {
    _id: string;
    name: string;
    lastSync: string;
  };
}

const syncToHive = async () => {
  const provider = new DockerProvider(new Docker());

  const instances = await provider.getInstances();

  const {
    data: { drone },
  } = await queryHive<{ data: DroneInfo }>('/drone', 'GET');

  const instancesLogs = await PromiseBB.reduce(
    instances,
    async (acc, instance) => {
      return [
        ...acc,
        [
          instance.name,
          await provider.getLogs(instance.name, 1000, Math.floor(new Date(drone.lastSync).getTime() / 1000)),
        ],
      ];
    },
    []
  );
  const message: SyncMessage = { instances, instancesLogs };
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
