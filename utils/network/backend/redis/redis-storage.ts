import { BuildStorage } from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { logWarningInSentry } from '#utils/sentry';
import { promiseTimeout } from './promise-timeout';

export class RedisStorage implements BuildStorage {
  static isRedisEnabled = process.env.REDIS_ENABLED === 'enabled';
  private _client;

  constructor(private cache_timeout: number) {
    if (!RedisStorage.isRedisEnabled) {
      throw new Error('Redis is disabled');
    }

    this._client = createClient({
      url: process.env.REDIS_URL,
      pingInterval: 1000,
    });

    this._client.on('error', (err) => {
      logWarningInSentry('Error in Redis', { details: err });
    });
  }

  private async connect() {
    if (!this._client.isOpen) {
      try {
        return this._client.connect();
      } catch (e) {
        logWarningInSentry('Could not connect to redis client');
      }
    }
  }

  find = async (key: string) => {
    await this.connect();
    const result = await promiseTimeout(this._client.get(key), 100).catch(
      (err) => {
        logWarningInSentry(err);
        return null;
      }
    );

    return result ? JSON.parse(result) : result;
  };

  set = async (key: string, value: any) => {
    await this.connect();
    await promiseTimeout(
      this._client.set(key, JSON.stringify(value), {
        PX: this.cache_timeout,
      }),
      200
    ).catch((err) => {
      logWarningInSentry(err);
    });
  };

  remove = async (key: string) => {
    await this.connect();
    await this._client.del(key);
  };
}
