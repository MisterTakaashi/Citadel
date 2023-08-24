import { Request, Response } from 'express';
import { renderError, renderSuccess } from '@citadel/lib';
import { sign } from 'jsonwebtoken';
import Account, { AccountModel } from '../models/account';
import { SessionModel } from '../models/session';

interface SessionCreateRequest {
  email: string;
  password: string;
}

class SessionController {
  // GET /sessions/:token
  async details(req: Request, res: Response) {
    const { token } = req.params;

    const session = await SessionModel.findOne({ token }).populate('account');
    if (!session) {
      renderError(res, 404, 'Cannot find token');
      return;
    }

    const account = session.account as Account;

    renderSuccess(res, { account: { email: account.email } });
  }

  // POST /sessions
  async create(req: Request, res: Response) {
    const { email, password } = req.body as SessionCreateRequest;

    const account = await AccountModel.findOne({
      email,
      password: Account.hashPassword(Account.saltPassword(password)),
    });

    if (!account) {
      renderError(res, 403, 'Cannot find an account with this email/password');
      return;
    }

    const token = sign({ email }, process.env.JWT_SECRET);

    await SessionModel.create({ account, token, lastConnection: new Date() });

    renderSuccess(res, {
      token,
    });
  }
}

export default SessionController;
