import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MemoryInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const type: GqlContextType = context.getType();

    // Variable to capture the request object
    let messageTopic: string;
    let leakedMemoryThreshold = 1;

    // Handle different types of request contexts
    switch (type) {
      case 'http': {
        const req = context.switchToHttp().getRequest();
        messageTopic = `[HTTP] ${req.method} ${req.url}`;
        console.log(`[HTTP] ${req.method} ${req.url}`);
        break;
      }
      case 'ws': {
        messageTopic = `[WebSocket] Memory usage monitoring`;
        console.log(`[WebSocket] Memory usage monitoring`);
        break;
      }
      case 'rpc': {
        messageTopic = `[RPC] Memory usage monitoring`;
        console.log(`[RPC] Memory usage monitoring`);
        break;
      }
      case 'graphql': {
        // Access the GraphQL context safely
        const gqlContext = context.getArgByIndex(2); // The third argument is the GraphQL context
        const operationName = gqlContext?.req?.body?.operationName || 'Unnamed Operation';
        console.log(`[GraphQL] Operation: ${operationName}`);
        messageTopic = `[GraphQL] Operation: ${operationName}`;
        break;
      }
      default:
        messageTopic = `[Unknown] Memory usage monitoring`;
        console.log(`[Unknown] Memory usage monitoring`);
    }

    // Log memory usage before the request
    const initialMemory = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Initial Memory: ${initialMemory.toFixed(2)} MB`);

    return next.handle().pipe(
      tap(() => {
        // Log memory usage after the request is handled
        const finalMemory = process.memoryUsage().heapUsed / 1024 / 1024;
        const leakedMemory = finalMemory - initialMemory;
        if (leakedMemory > leakedMemoryThreshold) {
          this.logger.log(
            `Memory Leaked: ${messageTopic}, Total Leaked:${leakedMemory.toFixed(2)} MB, Threshold is ${leakedMemoryThreshold} MB`,
          );
        }
        console.log(`Final Memory: ${finalMemory.toFixed(2)} MB`);
      }),
    );
  }
}

// Note: For testing put this code block in endpoint
// let memoryLeakArray = [];
//     for (let i = 0; i < 1000000; i++) {
//       let obj = {
//         id: i,
//         data: 'A very large string to consume memory...'.repeat(100),
//       };
//       memoryLeakArray.push(obj); // Keeping references to these objects
//     }
