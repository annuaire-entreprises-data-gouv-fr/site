import { clientEss } from "#clients/api-data-gouv/ess";
import type { Siren } from "#utils/helpers";
import { expectClientToMatchSnapshot } from "../expect-client-to-match-snapshot";

describe("clientAssociation", () => {
  it("Should match snapshot", async () => {
    await expectClientToMatchSnapshot({
      client: clientEss,
      args: ["800329849" as Siren],
      snapshotFile: "api-data-gouv-ess-800329849.json",
      __dirname,
    });
  });
});
