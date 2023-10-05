import { clientBanGeoLoc } from '#clients/base-adresse';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientBanGeoLoc', () => {
  [
    '129 rue lamarck, 75018 paris 18',
    'manakin production, 129 rue lamarck, 75018 paris 18',
    '129 rue lamarck, 75018 paris 18e',
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
