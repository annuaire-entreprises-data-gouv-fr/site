import { clientBilansFinanciers } from '#clients/open-data-soft/clients/bilans-financiers';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientBilansFinanciers', () => {
  it('Should match snapshot 487444697', async () => {
    await expectClientToMatchSnapshot({
      client: clientBilansFinanciers,
      args: ['487444697' as Siren],
      snaphotFile: '487444697.json',
      __dirname,
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
  it.skip('Should match snapshot 552032534', async () => {
    await expectClientToMatchSnapshot({
      client: clientBilansFinanciers,
      args: ['552032534' as Siren],
      snaphotFile: '552032534.json',
      __dirname,
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
});
