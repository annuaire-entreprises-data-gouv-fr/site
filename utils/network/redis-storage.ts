import { createClient } from 'redis';
import { buildStorage } from 'axios-cache-interceptor';

const client = createClient({ url: process.env.REDIS_URL });

client.connect();

const redisStorage = buildStorage({
  async find(key: string) {
    const result = await client.get(`axios-cache:${key}`);
    return result ? JSON.parse(result) : result;
  },

  async set(key: string, value: any) {
    await client.set(`axios-cache:${key}`, JSON.stringify(value));
  },

  async remove(key: string) {
    await client.del(`axios-cache:${key}`);
  },
});

export default redisStorage;
