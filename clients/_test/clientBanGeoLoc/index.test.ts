import { clientBanGeoLoc } from '#clients/base-adresse';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientBanGeoLoc', () => {
  [
    'rue jules ferry, 64110 mazeres-lezons',
    'rue jules ferry 64110 mazeres-lezons',
    '16 rue de tolbiac, 75013 paris 13e',
    '16 rue de tolbiac 75013 paris 13',
  ].forEach(expectClientToMatchSnapshotWithAddress);
});

function expectClientToMatchSnapshotWithAddress(address: string) {
  it(`Should match snapshot with address ${address}`, async () => {
    await expectClientToMatchSnapshot({
      client: clientBanGeoLoc,
      __dirname,
      args: [address],
      snaphotFile: `address-${address}.json`,
    });
  });
}
