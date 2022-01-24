import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Instance extends TimeStamps {
  @prop()
  public ip: string;

  @prop()
  public port: string;
}

const InstanceModel = getModelForClass(Instance);

export default Instance;
export { InstanceModel };
