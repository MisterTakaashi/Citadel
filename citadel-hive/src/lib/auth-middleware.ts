import { Context, Next } from 'koa';
import { SessionModel } from '../models/session';
import { IncomingHttpHeaders } from 'http';
import { ServerModel } from '../models/server';

const makeBadAuthentification = (ctx: Context) => {
  ctx.status = 401;

  ctx.body = {
    error: true,
    message: 'Bad authorization',
  };
};

interface AuthenticatedRequestHeadersAddons {
  'x-api-key': string;
}

type AuthenticatedRequestHeaders = IncomingHttpHeaders & AuthenticatedRequestHeadersAddons;

const validateServerAuthentication = async (ctx: Context, next: Next) => {
  const { 'x-api-key': token } = ctx.request.headers as AuthenticatedRequestHeaders;

  const server = await ServerModel.findOne({ token });

  if (!server) {
    makeBadAuthentification(ctx);

    return;
  }

  ctx.server = server;

  await next();
};

const validateAuthentication = async (ctx: Context, next: Next) => {
  const { authorization } = ctx.request.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    makeBadAuthentification(ctx);

    return;
  }

  const token = authorization.replace('Bearer ', '');
  const session = await SessionModel.findOne({ token }).populate('account');

  if (!session) {
    makeBadAuthentification(ctx);

    return;
  }

  ctx.session = session;

  await next();
};

export { validateAuthentication, validateServerAuthentication };
