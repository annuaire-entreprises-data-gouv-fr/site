import { clientRGE } from '#clients/rge';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientRGE', () => {
  it('Should match snapshot Certificat OPQIBI', async () => {
    await expectClientToMatchSnapshot({
      client: clientRGE,
      args: ['528163777' as Siren],
      __dirname,
      snaphotFile: 'certificat-OPQIBI.json',
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
