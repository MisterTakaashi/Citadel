import { InstanceInfo } from 'citadel-lib';

interface BaseProvider {
  getInstances(): Promise<InstanceInfo[]>;
  getInstance(name: string): Promise<InstanceInfo | undefined>;
  startInstance(name: string): Promise<void>;
  stopInstance(name: string): Promise<void>;
  createInstance(image: string, name?: string): Promise<string>;
  removeInstance(name: string): Promise<void>;
  fetchBinaries: (repoTag: string) => Promise<void>;
  getLogs(name: string, tail: number, since?: number): Promise<string[]>;
}

export default BaseProvider;
