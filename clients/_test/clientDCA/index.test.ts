import { clientDCA } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientDCA', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientDCA,
      args: ['338365059' as Siren, 'W643000551'],
      snaphotFile: 'association-dca.json',
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
      __dirname,
    });
  });
});
