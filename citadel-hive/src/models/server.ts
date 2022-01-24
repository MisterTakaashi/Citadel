import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Server extends TimeStamps {
  @prop()
  public ip: string;

  @prop()
  public port: string;
}

const ServerModel = getModelForClass(Server);

export default Server;
export { ServerModel };
