import { clientDCA } from '#clients/open-data-soft/clients/journal-officiel-associations';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientDCA', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientDCA,
      args: ['338365059' as Siren, 'W643000551'],
      snaphotFile: 'association-dca.json',
      __dirname,
    });
  });
});
