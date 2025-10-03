import { clientTVA } from "#clients/api-proxy/tva";
import type { TVANumber } from "#utils/helpers";
import { expectClientToMatchSnapshot } from "../expect-client-to-match-snapshot";

const TIMEOUT_TVA = 30000;

describe("clientTVA", () => {
  it(
    "Should match snapshot",
    async () => {
      const testValues = [
        // '11198100125',
        // '30487444697',
        // '27552032534',
        // '39356000000',
        "883010316", // Non assujetie
        "423208180", // Non assujetie
        "43842019051",
        "72217500016",
      ];
      for (let arg of testValues) {
        await expectClientToMatchSnapshot({
          client: clientTVA,
          args: [arg as TVANumber],
          __dirname,
          snapshotFile: `tva-${arg}.json`,
        });
      }
    },
    TIMEOUT_TVA
  );
});
