import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Server extends TimeStamps {
  @prop({ required: true, unique: true })
  public url: string;

  @prop({ required: true })
  public publicIp: string;
}

const ServerModel = getModelForClass(Server);

export default Server;
export { ServerModel };
