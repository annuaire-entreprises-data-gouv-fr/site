import { clientEpcisByName } from '#clients/geo/epcis';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEpcisByName', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientEpcisByName,
      args: ['Nice'],
      snaphotFile: 'nice.json',
      __dirname,
    });
  });
});
