import { buildStorage } from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { logWarningInSentry } from '#utils/sentry';
import { promiseTimeout } from './promise-timeout';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  pingInterval: 1000,
});

redisClient.on('error', (err) => {
  logWarningInSentry('Error in Redis', { details: err });
});

redisClient.connect();

const redisStorage = (cache_timeout: number) =>
  buildStorage({
    async find(key: string) {
      const result = await promiseTimeout(
        redisClient.get(`axios-cache:${key}`),
        100
      ).catch((err) => {
        logWarningInSentry('Redis client timeout', {});
        return null;
      });

      return result ? JSON.parse(result) : result;
    },

    async set(key: string, value: any) {
      const fullKey = `axios-cache:${key}`;
      await promiseTimeout(
        redisClient.set(fullKey, JSON.stringify(value), {
          PX: cache_timeout,
        }),
        200
      ).catch((err) => {
        logWarningInSentry('Redis client timeout', {});
      });
    },

    async remove(key: string) {
      await redisClient.del(`axios-cache:${key}`);
    },
  });

export default redisStorage;
