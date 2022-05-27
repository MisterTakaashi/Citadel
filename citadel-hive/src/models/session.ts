import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import Account from './account';

class Session extends TimeStamps {
  @prop({ required: true })
  public token: string;

  @prop({ required: true })
  public lastConnection: Date;

  @prop({ ref: 'Account', required: true })
  public account: Ref<Account>;
}

const SessionModel = getModelForClass(Session);

export default Session;
export { SessionModel };
