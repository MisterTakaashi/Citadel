import { Ref, getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import Server from './server';
import { InstanceInfo } from 'citadel-lib';

class Instance extends TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, ref: Server })
  public drone: Ref<Server>;

  @prop({ required: true })
  public infos: InstanceInfo;
}

const InstanceModel = getModelForClass(Instance);

export default Instance;
export { InstanceModel };
