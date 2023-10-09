import { clientEntrepreneurSpectacles } from '#clients/open-data-soft/clients/entrepreneur-spectacles';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEntrepreneurSpectacles', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientEntrepreneurSpectacles,
      args: ['842019051' as Siren],
      __dirname,
      snaphotFile: 'entrepreneur-spectacles.json',
    });
  });
});
