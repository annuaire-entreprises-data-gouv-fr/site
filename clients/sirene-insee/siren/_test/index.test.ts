import path from 'path';
import { Siren } from '#utils/helpers';
import { clientUniteLegaleInsee } from '..';

describe('clientUniteLegaleInsee', () => {
  (
    [
      '200054781',
      '300025764',
      '351556394',
      '356000000',
      '528163777',
      '839517323',
      '842019051',
      '908595879',
    ] as Siren[]
  ).forEach(expectClientToMatchSnapshotWithSiren);
});

function expectClientToMatchSnapshotWithSiren(siren: Siren) {
  it(`Should match snapshot with siren ${siren}`, async () => {
    const args = [
      siren,
      {
        useFallback: false,
        useCache: false,
      },
    ] as const;
    const result = await clientUniteLegaleInsee(...args);

    expect(JSON.stringify({ args: args[0], result }, null, 2)).toMatchFile(
      path.join(__dirname, `./siren-${siren}.json`)
    );
  });
}
