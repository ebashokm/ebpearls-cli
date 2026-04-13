import { Injectable, NestMiddleware, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request, Response, NextFunction } from 'express';
import { OperationDefinitionNode, parse } from 'graphql';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req?.body?.query) {
      const { query } = req.body; // Extract the GraphQL query

      const parsedQuery = parse(query);
      const operationDef = parsedQuery.definitions.find(
        (def): def is OperationDefinitionNode => def.kind === 'OperationDefinition',
      );

      const operationType = operationDef?.operation; // 'query' or 'mutation'
      const operationName = operationDef?.name?.value || 'Unnamed Operation';

      const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress; // Updated from `connection`
      const method = req.method;
      const url = req.originalUrl;

      if (operationName !== 'IntrospectionQuery') {
        this.logger.log(`Request: ${method} ${url} ${operationType} ${operationName} - IP: ${ip}`);
      }
    }

    next();
  }
}
