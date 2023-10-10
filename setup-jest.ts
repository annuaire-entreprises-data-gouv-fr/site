import { toMatchFile } from 'jest-file-snapshot';
import { disconnect } from '#utils/network/backend/redis/redis-storage';
import 'dotenv/config';

expect.extend({ toMatchFile });

afterAll(async () => {
  await disconnect();
});
