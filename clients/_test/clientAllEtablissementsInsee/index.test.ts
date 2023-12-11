import { clientAllEtablissementsInsee } from '../../sirene-insee/siret';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

describe('clientAllEtablissementsInsee', () => {
  // We use the commented lines to generate snapshots for
  // E2E testing.
  // Hovewer, we don't test them for regression because the result
  // of the pagination changes systematically between API calls.

  [
    '198100125', // établissement scolaire

    // '200054781',
    // '300025764',
    '338365059',
    '351556394',
    // '528163777',
    '839517323', // entreprise cessée
    '843701079', // Qualibat RGE
    '883010316',
    '880878145',
    '908595879',
  ].forEach((siren) => expectClientToMatchSnapshotWithSiren(siren));
  // expectClientToMatchSnapshotWithSiren('356000000', 1);
  // expectClientToMatchSnapshotWithSiren('356000000', 3);
  // expectClientToMatchSnapshotWithSiren('356000000', 5);
  // expectClientToMatchSnapshotWithSiren('356000000', 6);
  // expectClientToMatchSnapshotWithSiren('356000000', 7);
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
