import path from 'path';
import { HttpServerError, HttpTimeoutError } from '#clients/exceptions';

type IParams<T extends unknown[], U> = {
  client: (...args: T) => Promise<U>;
  args: T;
  snaphotFile: string;
  simplifyParams?: (...args: T) => any;
  postProcessResult?: (result: U) => void;
  __dirname: string;
};

export async function expectClientToMatchSnapshot<T extends unknown[], U>({
  client,
  args,
  snaphotFile,
  simplifyParams = (...args: T) => args,
  postProcessResult,
  __dirname,
}: IParams<T, U>) {
  let result: U | undefined;
  try {
    result = await client(...args);
  } catch (e) {
    try {
      console.log('Second try');
      result = await client(...args);
    } catch (e) {
      if (e instanceof HttpServerError || e instanceof HttpTimeoutError) {
        console.warn('Could not test siret client (api not responding)');
        return;
      } else {
        throw e;
      }
    }
  } finally {
    if (!result) {
      return;
    }
    if (postProcessResult) {
      postProcessResult(result);
    }
    expect(
      JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
    ).toMatchFile(path.join(__dirname, '_snapshots', snaphotFile));
  }
}
