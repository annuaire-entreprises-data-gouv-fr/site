import { clientDepartementsByName } from '#clients/geo/departements';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientDepartementsByName', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientDepartementsByName,
      args: ['Nice'],
      snapshotFile: 'nice.json',
      __dirname,
    });
  });
});
