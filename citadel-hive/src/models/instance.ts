import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import Drone from './drone';
import { InstanceInfo } from '@citadelnest/lib';

class Instance extends TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, ref: Drone })
  public drone: Ref<Drone>;

  @prop({ required: true })
  public infos: InstanceInfo;
}

const InstanceModel = getModelForClass(Instance);

export default Instance;
export { InstanceModel };
