import IORedis from 'ioredis';

export const redisConnection = new IORedis(process.env.REDIS_URL);
