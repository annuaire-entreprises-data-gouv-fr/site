/** biome-ignore-all lint/correctness/noGlobalDirnameFilename: needed for test */
import { clientAllEtablissementsInsee } from "../../sirene-insee/siret";
import { expectClientToMatchSnapshot } from "../expect-client-to-match-snapshot";
import simplifyParams from "./simplify-params";

describe("clientAllEtablissementsInsee", () => {
  // We use the commented lines to generate snapshots for
  // E2E testing.
  // Hovewer, we don't test them for regression because the result
  // of the pagination changes systematically between API calls.

  ["908595879", "883010316"].forEach((siren) =>
    expectClientToMatchSnapshotWithSiren(siren)
  );
});

function expectClientToMatchSnapshotWithSiren(siren: string, page = 1) {
  it(`Should match snapshot with siren ${siren}${
    page !== 1 ? " and page " + page : ""
  }`, async () => {
    await expectClientToMatchSnapshot({
      __dirname,
      client: clientAllEtablissementsInsee,
      args: [siren, page, false],
      snapshotFile: `siren-${siren}${page !== 1 ? "-page-" + page : ""}.json`,
      simplifyParams,
      postProcessResult: (result) => {
        result.list.forEach((etablissement) => {
          etablissement.dateDerniereMiseAJour = "2024-12-11T16:09:12.625Z";
        });
      },
    });
  });
}
