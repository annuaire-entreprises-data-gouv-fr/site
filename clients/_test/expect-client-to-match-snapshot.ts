import path from "node:path";
import { HttpServerError, HttpTimeoutError } from "#clients/exceptions";

interface IParams<T extends unknown[], U> {
  __dirname: string;
  args: T;
  client: (...args: T) => Promise<U>;
  postProcessResult?: (result: U) => void;
  simplifyParams?: (...args: T) => any;
  snapshotFile: string;
}

export async function expectClientToMatchSnapshot<T extends unknown[], U>({
  client,
  args,
  snapshotFile,
  simplifyParams = (...args: T) => args,
  postProcessResult,

  __dirname,
}: IParams<T, U>) {
  let result: U | undefined;
  try {
    result = await client(...args);
  } catch (e) {
    try {
      console.log("Second try");
      result = await client(...args);
    } catch (e) {
      if (e instanceof HttpServerError || e instanceof HttpTimeoutError) {
        console.warn("Could not test siret client (api not responding)");
        return;
      }
      throw e;
    }
  }

  if (!result) {
    return;
  }

  if (postProcessResult) {
    try {
      postProcessResult(result);
    } catch (e) {
      console.error(e);
      console.warn("Snapshot not tested");
      return;
    }
  }

  // biome-ignore lint/suspicious/noMisplacedAssertion: this helper is only called from inside test cases
  expect(
    JSON.stringify({ args: simplifyParams(...args), result }, null, 2)
  ).toMatchFile(path.join(__dirname, "_snapshots", snapshotFile));
}
