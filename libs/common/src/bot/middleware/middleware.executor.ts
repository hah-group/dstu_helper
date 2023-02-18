import { lodash } from '../../type';
import { BaseMiddleware } from './base.middleware';

export class MiddlewareExecutor {
  public static Execute<T>(ctx: T, middlewares: BaseMiddleware[]): any {
    const results = middlewares.map((middleware) => {
      return middleware.middleware(ctx);
    });

    return results.reduce((p, c) => lodash.merge(p, c));
  }
}
