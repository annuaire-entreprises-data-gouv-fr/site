import { clientRegionsByName } from '#clients/geo/regions';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientRegionsByName', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientRegionsByName,
      args: ['Nice'],
      snaphotFile: 'nice.json',
      __dirname,
    });
  });
});
