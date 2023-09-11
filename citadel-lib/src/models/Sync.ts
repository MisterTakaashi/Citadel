import InstanceInfo from "./InstanceInfo";

interface SyncMessage {
  instances: InstanceInfo[];
  instancesLogs: { [instanceName: string]: string[] };
}

export default SyncMessage;
