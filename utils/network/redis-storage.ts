import { createClient } from 'redis';
import { buildStorage } from 'axios-cache-interceptor';

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (err) =>
  console.error('Redis redisClient Error : ', err)
);

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
