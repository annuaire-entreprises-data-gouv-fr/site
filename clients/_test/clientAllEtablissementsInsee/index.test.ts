import { clientAllEtablissementsInsee } from '../../sirene-insee/siret';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

describe('clientAllEtablissementsInsee', () => {
  // We use the commented lines to generate snapshots for
  // E2E testing.
  // Hovewer, we don't test them for regression because the result
  // of the pagination changes systematically between API calls.

  ['908595879', '883010316'].forEach((siren) =>
    expectClientToMatchSnapshotWithSiren(siren)
  );
});

function expectClientToMatchSnapshotWithSiren(siren: string, page = 1) {
  it(`Should match snapshot with siren ${siren}${
    page !== 1 ? ' and page ' + page : ''
  }`, async () => {
    await expectClientToMatchSnapshot({
      __dirname,
      client: clientAllEtablissementsInsee,
      args: [
        siren,
        page,
        {
          useFallback: false,
          useCache: false,
        },
      ],
      snaphotFile: `siren-${siren}${page !== 1 ? '-page-' + page : ''}.json`,
      simplifyParams,
    });
  });
}
