import { clientEntrepreneursSpectacles } from "#clients/api-data-gouv/entrepreneurs-spectacles";
import type { Siren } from "#utils/helpers";
import { expectClientToMatchSnapshot } from "../expect-client-to-match-snapshot";

describe("clientAssociation", () => {
  it("Should match snapshot", async () => {
    await expectClientToMatchSnapshot({
      client: clientEntrepreneursSpectacles,
      args: ["800329849" as Siren],
      snapshotFile: "api-data-gouv-entrepreneurs-spectacles-800329849.json",
      __dirname,
    });
  });
});
