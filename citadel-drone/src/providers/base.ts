import { InstanceInfo } from 'citadel-lib';

interface BaseProvider {
  getInstances(): Promise<InstanceInfo[]>;
  getInstance(name: string): Promise<InstanceInfo | undefined>;
  startInstance(name: string): Promise<void>;
  stopInstance(name: string): Promise<void>;
  createInstance(image: string): Promise<string>;
  fetchBinaries: (repoTag: string) => Promise<void>;
}

export default BaseProvider;
