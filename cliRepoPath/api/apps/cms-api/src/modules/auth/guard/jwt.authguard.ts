import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class JwtAuthGuard
 * @typedef {JwtAuthGuard}
 * @extends {AuthGuard('jwt')}
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * ${1:Description placeholder}
   *
   * @param {ExecutionContext} context
   * @returns {*}
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
