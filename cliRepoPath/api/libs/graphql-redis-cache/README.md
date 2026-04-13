# Redis Cache Module

The **Redis Cache module** provides **query-level caching** for GraphQL resolvers using Redis.
It allows developers to cache responses declaratively using a **decorator** and a **GraphQL interceptor**.

---

## Locations

```
libs/graphql-redis-cache/
  ├── src/cache.module.ts
  ├── src/index.ts
  ├── decorators/graphql-redis-cache.decorator.ts
  ├── interceptors/graphql-redis-cache.interceptor.ts
```

---

## Overview

* Provides Redis-backed caching for GraphQL resolvers
* Declarative caching via `@Cache()` decorator
* Uses `GraphqlCacheInterceptor` to intercept queries and store results in Redis
* Supports TTL (time-to-live) and custom cache keys
* Exported as `RedisCacheModule` for easy import into the application

---

## How It Works

### Cache Decorator

**Location**

```
libs/graphql-redis-cache/decorators/graphql-redis-cache.decorator.ts
```

```ts
export interface CacheOptions {
  ttlMs?: number;  // time-to-live in milliseconds
  key?: string;    // optional custom cache key
}

export const Cache = (options?: CacheOptions) => {
  return SetMetadata(CACHE_METADATA_KEY, options || {});
};
```

* Attach `@Cache()` to any GraphQL query or mutation
* Optional `ttlMs` controls how long the response is cached
* Optional `key` can override the default cache key

**Example:**

```ts
@Query(() => PermissionResponse)
@Cache({ ttlMs: 60000 }) // cache for 60 seconds
async getPermissions() {
  return this.permissionService.findAll();
}
```

---

### GraphqlCacheInterceptor

**Location**

```
libs/graphql-redis-cache/interceptors/graphql-redis-cache.interceptor.ts
```

* Intercepts queries annotated with `@Cache()`
* Checks Redis for cached response
* Returns cached result if available
* Stores fresh results in Redis if not cached

---

## Using Redis Cache Module

1. Import the module in your app module:

```ts
import { RedisCacheModule } from '@app/graphql-redis-cache';

@Module({
  imports: [RedisCacheModule],
})
export class AppModule {}
```

2. Use the `@Cache()` decorator on queries or mutations
3. The `GraphqlCacheInterceptor` automatically handles caching

---

## Removing the Redis Cache Module

To remove caching completely:

1. Remove module import:

```ts
// AppModule
imports: [
  // remove RedisCacheModule
]
```

2. Remove all uses of the `@Cache()` decorator in resolvers
3. Delete the library:

```
libs/graphql-redis-cache/
```
---

## Notes

* TTL and cache key are optional(default 1 day)
* Can cache any GraphQL resolver response
* Centralized caching logic via interceptor
* No changes needed inside service methods
* Works declaratively and is easy to remove if caching is no longer needed
