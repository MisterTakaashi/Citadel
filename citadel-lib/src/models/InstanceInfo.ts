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
}

export default InstanceInfo;
