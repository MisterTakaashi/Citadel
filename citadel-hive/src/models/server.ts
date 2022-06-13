import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Server extends TimeStamps {
  @prop({ required: true })
  public name: string;

  @prop({ required: true, unique: true })
  public url: string;

  @prop({ required: true })
  public publicIp: string;

  @prop({ require: true, default: true })
  public selfHosted: boolean;
}

const ServerModel = getModelForClass(Server);

export default Server;
export { ServerModel };
