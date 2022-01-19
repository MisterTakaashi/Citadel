import { Context } from 'koa';

class ApplicationController {
  renderSuccess<T>(ctx: Context, data: T) {
    ctx.body = {
      error: false,
      data: data,
    };
  }

  renderError(ctx: Context, code: number, message: string) {
    ctx.status = code;

    ctx.body = {
      error: true,
      message: message,
    };
  }
}

export default ApplicationController;
