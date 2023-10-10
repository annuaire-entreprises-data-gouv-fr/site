import {} from '#clients/geo/departements';
import { clientRegionsByName } from '#clients/geo/regions';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientRegionByName', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientRegionsByName,
      args: ['Nice'],
      __dirname,
      snaphotFile: 'Nice.json',
    });
  });
});
