import { commonControllers } from 'citadel-lib';
import { Context } from 'koa';
import { sign } from 'jsonwebtoken';
import Account, { AccountModel } from '../models/account';
import { SessionModel } from '../models/session';

class SessionController extends commonControllers.ApplicationController {
  // GET /sessions/:token
  async details(ctx: Context) {
    const { token } = ctx.params;

    const session = await SessionModel.findOne({ token }).populate('account');
    if (!session) {
      this.renderError(ctx, 404, 'Cannot find token');
      return;
    }

    const account = session.account as Account;

    this.renderSuccess(ctx, { account: { email: account.email } });
  }

  // POST /sessions
  async create(ctx: Context) {
    const { email, password } = ctx.request.body;

    const account = await AccountModel.findOne({
      email,
      password: Account.hashPassword(Account.saltPassword(password)),
    });

    if (!account) {
      this.renderError(ctx, 403, 'Cannot find an account with this email/password');
      return;
    }

    const token = sign({ email }, process.env.JWT_SECRET);

    await SessionModel.create({ account, token, lastConnection: new Date() });

    this.renderSuccess(ctx, {
      token,
    });
  }
}

export default SessionController;
