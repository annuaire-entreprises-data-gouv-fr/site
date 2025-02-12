import { clientEntrepreneurSpectacles } from '#clients/open-data-soft/clients/entrepreneur-spectacles';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEntrepreneurSpectacles', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientEntrepreneurSpectacles,
      args: ['800329849' as Siren],
      __dirname,
      snapshotFile: 'entrepreneur-spectacles.json',
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
});
