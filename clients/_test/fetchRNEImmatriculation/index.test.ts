import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('fetchRNEImmatriculation', () => {
  it('Should match snapshot for protected uniteLegale with the characteristics (PROTECTED)', async () => {
    await expectClientToMatchSnapshot({
      client: fetchRNEImmatriculation,
      args: ['908595879' as Siren],
      __dirname,
      snaphotFile: 'protected.json',
    });
  });

  it('Should match snapshot for protected uniteLegale with the characteristics (RGE)', async () => {
    await expectClientToMatchSnapshot({
      client: fetchRNEImmatriculation,
      args: ['528163777' as Siren],
      __dirname,
      snaphotFile: 'rge.json',
    });
  });

  it('Should match snapshot for 356000000 siret', async () => {
    await expectClientToMatchSnapshot({
      client: fetchRNEImmatriculation,
      args: ['356000000' as Siren],
      __dirname,
      snaphotFile: 'siret-356000000.json',
    });
  }, 30000);
});
