import { clientCommunesByName } from '#clients/geo/communes';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientCommunesByName', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientCommunesByName,
      args: ['Nice'],
      __dirname,
      snaphotFile: 'Nice.json',
    });
  });
});
