import InstanceVolume from "./InstanceVolume";

export enum InstanceState {
  Created = 'created',
  Running = 'running',
  Exited = 'exited',
}

type InstanceInfo = {
  name: string;
  image: string;
  state: InstanceState;
  portsMapping: {[instancePort: string]: string};
  environmentVariables: string[];
  volumes: InstanceVolume[];
}

export default InstanceInfo;
