import 'dotenv/config';
import { toMatchFile } from 'jest-file-snapshot';

expect.extend({ toMatchFile });
