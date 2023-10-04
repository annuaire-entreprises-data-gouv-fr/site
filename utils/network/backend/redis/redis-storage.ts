import { buildStorage } from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { logWarningInSentry } from '#utils/sentry';
import { promiseTimeout } from './promise-timeout';

let redisClient = createClient({
  url: process.env.REDIS_URL,
  pingInterval: 1000,
});

redisClient.on('error', (err) => {
  logWarningInSentry('Error in Redis', { details: err });
});

export async function connect() {
  if (!redisClient.isOpen) {
    return redisClient.connect();
  }
}

const redisStorage = (cache_timeout: number) =>
  buildStorage({
    async find(key: string) {
      const result = await promiseTimeout(redisClient.get(key), 100).catch(
        (err) => {
          logWarningInSentry('Redis client timeout', { details: err });
          return null;
        }
      );

      return result ? JSON.parse(result) : result;
    },

    async set(key: string, value: any) {
      await promiseTimeout(
        redisClient.set(key, JSON.stringify(value), {
          PX: cache_timeout,
        }),
        200
      ).catch((err) => {
        logWarningInSentry('Redis client timeout', {});
      });
    },

    async remove(key: string) {
      await redisClient.del(key);
    },
  });

export default redisStorage;
export async function disconnect() {
  if (redisClient.isOpen) {
    redisClient.removeAllListeners();
    return await redisClient.disconnect();
  }
}
