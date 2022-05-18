import { commonControllers } from 'citadel-lib';
import { Context } from 'koa';
import Account, { AccountModel } from '../models/account';

class AccountController extends commonControllers.ApplicationController {
  // POST /accounts
  async create(ctx: Context) {
    const { email, password } = ctx.request.body;

    if (!email) {
      this.renderError(ctx, 400, 'You must specify an email');
      return;
    }

    if (!password || password.length <= 8) {
      this.renderError(ctx, 400, 'You must specify a password with more than 8 characters');
      return;
    }

    const newAccount = new AccountModel({
      email,
      password: Account.hashPassword(Account.saltPassword(password)),
    });

    this.renderSuccess(ctx, { account: await newAccount.save() });
  }
}

export default AccountController;
