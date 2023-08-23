import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import Account from './account';

class Drone extends TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public token: string;

  @prop({ required: true, default: false })
  public registered = false;

  @prop({ required: true })
  public publicIp: string;

  @prop({ required: true, default: true })
  public selfHosted: boolean;

  @prop({ ref: 'Account', required: true })
  public owner: Ref<Account>;

  @prop()
  public lastSync?: Date;
}

const DroneModel = getModelForClass(Drone);

export default Drone;
export { DroneModel };
