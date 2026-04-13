import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GqlAuthGuard
 * @typedef {GqlAuthGuard}
 * @extends {AuthGuard('local')}
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard('local') {
  /**
   * ${1:Description placeholder}
   *
   * @param {ExecutionContext} context
   * @returns {*}
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext();
    request.body = ctx.getArgs().input;
    return request;
  }
}
