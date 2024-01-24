import { clientRGE } from '#clients/rge';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientRGE', () => {
  it('Should match snapshot Certificat Qualifelec', async () => {
    await expectClientToMatchSnapshot({
      client: clientRGE,
      args: ['487444697' as Siren],
      __dirname,
      snaphotFile: 'certificat-487444697.json',
    });
  });
  it('Should match snapshot QUALIBAT-RGE', async () => {
    await expectClientToMatchSnapshot({
      client: clientRGE,
      args: ['843701079' as Siren],
      __dirname,
      snaphotFile: 'qualibat-rge.json',
    });
  });
});
