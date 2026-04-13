import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const type = context.getType<'http' | 'rpc' | 'graphql' | 'ws'>(); // Explicitly include 'graphql' as a possible type

    if (type === 'http') {
      // Handle HTTP requests
      const httpCtx = context.switchToHttp();
      return { req: httpCtx.getRequest(), res: httpCtx.getResponse() };
    } else if (type === 'graphql') {
      // Handle GraphQL requests
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      return { req: ctx.req, res: ctx.res };
    }

    throw new Error(`Unsupported context type: ${type}`);
  }
}
