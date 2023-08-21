import { IncomingHttpHeaders } from 'http';
import { Request, Response, NextFunction } from 'express';
import Session, { SessionModel } from '../models/session';
import Server, { ServerModel } from '../models/server';

const makeBadAuthentification = (res: Response) => {
  res.status(401);
  res.json({
    error: true,
    message: 'Bad authorization',
  });
};

interface AuthenticatedRequestHeadersAddons {
  'x-api-key': string;
}

type AuthenticatedRequestHeaders = IncomingHttpHeaders & AuthenticatedRequestHeadersAddons;

const validateServerAuthentication = async (req: Request & { server: Server }, res: Response, next: NextFunction) => {
  const { 'x-api-key': token } = req.headers as AuthenticatedRequestHeaders;

  const server = await ServerModel.findOne({ token });

  if (!server) {
    makeBadAuthentification(res);

    return;
  }

  req.server = server;

  next();
};

const validateAuthentication = async (req: Request & { session: Session }, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    makeBadAuthentification(res);

    return;
  }

  const token = authorization.replace('Bearer ', '');
  const session = await SessionModel.findOne({ token }).populate('account');

  if (!session) {
    makeBadAuthentification(res);

    return;
  }

  req.session = session;

  next();
};

export { validateAuthentication, validateServerAuthentication };
