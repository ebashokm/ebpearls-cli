import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, raw, Request, Response } from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    raw({ type: '*/*' })(req, res, next);
  }
}

/** And apply this code in the app Module */
// [...]

// export class AppModule implements NestModule {
//     public configure(consumer: MiddlewareConsumer): void {
//         consumer
//             .apply(RawBodyMiddleware)
//             .forRoutes({
//                 path: '/stripe-webhook',
//                 method: RequestMethod.POST,
//             })
//             .apply(JsonBodyMiddleware)
//             .forRoutes('*');
//     }
// }

// [...]

/** And, Apply this in main.ts file */
// [...]

// const app = await NestFactory.create(AppModule, { bodyParser: false })

// [...]
