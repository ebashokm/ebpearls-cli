import { SetMetadata } from '@nestjs/common';

export const CACHE_METADATA_KEY = 'CACHE_METADATA';

export interface CacheOptions {
  ttlMs?: number;
  key?: string;
}

export const Cache = (options?: CacheOptions) => {
  return SetMetadata(CACHE_METADATA_KEY, options || {});
};
