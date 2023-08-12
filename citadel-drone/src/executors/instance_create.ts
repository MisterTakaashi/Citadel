import Docker from 'dockerode';
import { InstanceVolume } from 'citadel-lib';
import DockerProvider from '../providers/docker';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

interface InstanceCreateParams {
  image: string;
  name: string;
  config: {
    portsMapping: { [name: string]: string };
    volumes: InstanceVolume[];
    environmentVariables: { [name: string]: string };
    resources: {
      ram: number;
      cpu: number;
    };
  };
}

export default async (params: InstanceCreateParams) => {
  const { image, name, config } = params;

  logger.info(`Creating an instance (${name}) with image (${image})...`);

  const { portsMapping, volumes, environmentVariables, resources } = config;
  console.log(portsMapping, volumes, environmentVariables);

  const provider = new DockerProvider(new Docker());
  await provider.fetchBinaries(image);

  const instanceName = await provider.createInstance(image, name, {
    portsMapping,
    volumes: volumes.reduce<InstanceVolume[]>((acc, volume) => (volume.from.length === 0 ? acc : [...acc, volume]), []),
    environmentVariables,
    resources,
  });
  await provider.startInstance(instanceName);

  logger.info(`Instance (${name}) created and started.`);
};
