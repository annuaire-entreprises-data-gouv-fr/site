import type { Siren } from "#/utils/helpers";
import { clientUniteLegaleInsee } from "../../sirene-insee/siren";
import { expectClientToMatchSnapshot } from "../expect-client-to-match-snapshot";
import simplifyParams from "./simplify-params";

describe("clientUniteLegaleInsee", () => {
  for (const siren of ["908595879", "883010316", "300025764"] as Siren[]) {
    expectClientToMatchSnapshotWithSiren(siren);
  }
});

function expectClientToMatchSnapshotWithSiren(siren: Siren) {
  it(`Should match snapshot with siren ${siren}`, async () => {
    await expectClientToMatchSnapshot({
      client: clientUniteLegaleInsee,
      __dirname: import.meta.dirname,
      args: [siren, 1, false],
      snapshotFile: `siren-${siren}.json`,
      simplifyParams,
      postProcessResult: (result) => {
        result.dateDerniereMiseAJour = "2023-10-5";
        result.siege.dateDerniereMiseAJour = "2024-12-11T16:09:17.144Z";
        for (const etablissement of result.etablissements.all) {
          etablissement.dateDerniereMiseAJour = "2024-12-11T16:09:17.144Z";
        }
        for (const etablissement of result.etablissements.open) {
          etablissement.dateDerniereMiseAJour = "2024-12-11T16:09:17.144Z";
        }
        for (const etablissement of result.etablissements.closed) {
          etablissement.dateDerniereMiseAJour = "2024-12-11T16:09:17.144Z";
        }
      },
    });
  });
}
