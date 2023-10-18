import { clientBilansFinanciers } from '#clients/open-data-soft/clients/bilans-financiers';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientBilansFinanciers', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientBilansFinanciers,
      args: ['528163777' as Siren],
      snaphotFile: 'bilan-financier.json',
      __dirname,
    });
  });
});
