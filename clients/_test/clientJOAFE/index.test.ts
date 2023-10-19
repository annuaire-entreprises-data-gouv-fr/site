import { clientJOAFE } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientJOAFE', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientJOAFE,
      args: ['W643000551'],
      snaphotFile: 'association-joafe.json',
      __dirname,
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
});
