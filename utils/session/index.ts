// import { redisConnection } from '../../clients/local/redis';
import nextSession from 'next-session';
import redis from 'redis';
import { expressSession } from 'next-session/lib/compat';
import connectRedis from 'connect-redis';

let RedisStore = connectRedis(expressSession);
let redisClient = redis.createClient();

export const getSession = nextSession({
  store: new RedisStore({ client: redisClient }),
});
