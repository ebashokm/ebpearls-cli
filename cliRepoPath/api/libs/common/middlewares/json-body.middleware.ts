import { NextFunction, Request, Response, json } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class JsonBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    json()(req, res, next);
  }
}
