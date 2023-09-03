import InstanceInfo from "./InstanceInfo";

interface SyncMessage {
  instances: InstanceInfo[];
  instancesLogs: (string | string[])[][];
}

export default SyncMessage;
