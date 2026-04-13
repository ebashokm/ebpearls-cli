import { Module, Global } from '@nestjs/common';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CACHE',
      useFactory: () => {
        const redisHost = process.env.REDIS_HOST;
        const redisPort = process.env.REDIS_PORT;
        const redisPassword = process.env.REDIS_PASSWORD;

        // Build Redis URI: redis://:password@host:port
        const redisUri = `redis://:${redisPassword}@${redisHost}:${redisPort}`;

        const cache = new Keyv({
          store: new KeyvRedis(redisUri),
          ttl: 3600, // default TTL 1 hour
        });

        cache.on('error', (err) => console.error('Redis Error:', err));

        return cache;
      },
    },
  ],
  exports: ['REDIS_CACHE'],
})
export class RedisCacheModule {}
