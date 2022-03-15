import nextSession from 'next-session';
//@ts-ignore
import redis from 'redis';

import { promisifyStore, expressSession } from 'next-session/lib/compat';
import RedisStoreFactory from 'connect-redis';

const RedisStore = RedisStoreFactory(expressSession);

let redisClient = redis.createClient({ url: process.env.REDIS_URL });

export const getSession = nextSession({
  store: promisifyStore(new RedisStore({ client: redisClient })),
  cookie: { maxAge: 4 * 3600 }, // short sessions
});
