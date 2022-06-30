import { Context, Next } from 'koa';
import { SessionModel } from '../models/session';

const makeBadAuthentification = (ctx: Context) => {
  ctx.status = 401;

  ctx.body = {
    error: true,
    message: 'Bad authorization',
  };
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

export default validateAuthentication;
