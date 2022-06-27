import { createHash } from 'crypto';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import makeLogger from '../lib/logger';

const logger = makeLogger(module);

class Account extends TimeStamps {
  @prop({ required: true, unique: true })
  public email: string;

  @prop({ required: true })
  public password: string;

  public static saltPassword(pass: string): string {
    if (process.env.PASSWORD_SALT) {
      return `${process.env.PASSWORD_SALT}${pass}`;
    }

    logger.warn('No salt configured for password, this can be a security breach');
    return pass;
  }

  public static hashPassword(pass: string): string {
    return createHash('sha256').update(pass).digest('base64');
  }
}

const AccountModel = getModelForClass(Account);

export default Account;
export { AccountModel };
