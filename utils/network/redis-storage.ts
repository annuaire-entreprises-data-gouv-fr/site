import { buildStorage } from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { logWarningInSentry } from '#utils/sentry';

export const redisClient = createClient({
  url: process.env.REDIS_URL,
  pingInterval: 1000,
});

redisClient.on('error', (err) => {
  logWarningInSentry('Error in Redis', { details: err });
  console.error('Redis redisClient Error : ', err);
});

redisClient.connect();

const redisStorage = (cache_timeout: number) =>
  buildStorage({
    async find(key: string) {
      const result = await redisClient.get(`axios-cache:${key}`);
      return result ? JSON.parse(result) : result;
    },

    async set(key: string, value: any) {
      const fullKey = `axios-cache:${key}`;
      await redisClient.set(fullKey, JSON.stringify(value), {
        PX: cache_timeout,
      });
    },

    async remove(key: string) {
      await redisClient.del(`axios-cache:${key}`);
    },
  });

export default redisStorage;
