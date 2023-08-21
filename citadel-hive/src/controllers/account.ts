import { Request, Response } from 'express';
import { renderError, renderSuccess } from 'citadel-lib';
import Account, { AccountModel } from '../models/account';

interface AccountCreateRequest {
  email: string;
  password: string;
}

class AccountController {
  // POST /accounts
  async create(req: Request, res: Response) {
    const { email, password } = req.body as AccountCreateRequest;

    if (!email) {
      renderError(res, 400, 'You must specify an email');
      return;
    }

    if (!password || password.length <= 8) {
      renderError(res, 400, 'You must specify a password with more than 8 characters');
      return;
    }

    const newAccount = new AccountModel({
      email,
      password: Account.hashPassword(Account.saltPassword(password)),
    });

    renderSuccess(res, { account: await newAccount.save() });
  }
}

export default AccountController;
