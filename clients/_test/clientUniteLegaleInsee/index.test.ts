import { Siren } from '#utils/helpers';
import { clientUniteLegaleInsee } from '../../sirene-insee/siren';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

describe('clientUniteLegaleInsee', () => {
  (['908595879', '883010316', '300025764'] as Siren[]).forEach(
    expectClientToMatchSnapshotWithSiren
  );
});

function expectClientToMatchSnapshotWithSiren(siren: Siren) {
  it(`Should match snapshot with siren ${siren}`, async () => {
    await expectClientToMatchSnapshot({
      client: clientUniteLegaleInsee,
      __dirname,
      args: [
        siren,
        1,
        {
          useFallback: false,
          useCache: false,
        },
      ],
      snaphotFile: `siren-${siren}.json`,
      postProcessResult: (result) => {
        result.dateDerniereMiseAJour = '2023-10-5';
      },
      simplifyParams,
    });
  });
}
