import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Server extends TimeStamps {
  @prop()
  public url: string;
}

const ServerModel = getModelForClass(Server);

export default Server;
export { ServerModel };
