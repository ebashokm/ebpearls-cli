import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import Keyv from 'keyv';
import { Reflector } from '@nestjs/core';
import { CACHE_METADATA_KEY, CacheOptions } from '../src';

@Injectable()
export class GraphqlCacheInterceptor implements NestInterceptor {
  private readonly defaultTTLMs = 3600000; // 1day

  constructor(
    @Inject('REDIS_CACHE') private readonly cache: Keyv,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const gqlCtx = GqlExecutionContext.create(context);

    const handler = gqlCtx.getHandler(); // get the resolver method

    const info = gqlCtx.getInfo();
    const args = gqlCtx.getArgs();

    const cacheOptions = this.reflector.get<CacheOptions>(CACHE_METADATA_KEY, handler);

    const skipCache = !cacheOptions;
    if (skipCache) {
      return next.handle(); // skip caching entirely
    }

    const inputArgs = args && (args as any).input ? (args as any).input : args || {};

    const key = this.generateCacheKey(cacheOptions.key || info.fieldName, inputArgs);
    const ttlMs = cacheOptions.ttlMs || this.defaultTTLMs;

    return new Observable((observer) => {
      this.cache.get(key).then((cached) => {
        if (cached) {
          console.log('Cache hit!');
          observer.next(cached);
          observer.complete();
        } else {
          console.log('Cache miss, fetching from DB');
          next
            .handle()
            .pipe(
              tap((response) => {
                this.cache.set(key, response, ttlMs);
              }),
            )
            .subscribe({
              next: (val) => observer.next(val),
              error: (err) => observer.error(err),
              complete: () => observer.complete(),
            });
        }
      });
    });
  }

  private generateCacheKey(fieldName: string, args: any): string {
    const stable = this.stableStringify(args);
    return `graphql:${fieldName}:${stable}`;
  }

  private stableStringify(value: unknown): string {
    const seen = new WeakSet();
    const replacer = (_key: string, val: any) => {
      if (val && typeof val === 'object') {
        if (seen.has(val)) return undefined;
        seen.add(val);
        if (!Array.isArray(val)) {
          return Object.keys(val)
            .sort()
            .reduce(
              (acc, k) => {
                const v = val[k];
                if (v !== undefined) (acc as any)[k] = v;
                return acc;
              },
              {} as Record<string, unknown>,
            );
        }
      }
      return val;
    };
    return JSON.stringify(value, replacer);
  }
}
