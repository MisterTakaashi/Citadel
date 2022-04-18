export enum InstanceState {
  Created = 'created',
  Running = 'running',
  Exited = 'exited',
}

export default class InstanceInfo {
  name: string;
  image: string;
  state: InstanceState;
  portsMapping: {[instancePort: string]: string};
}
