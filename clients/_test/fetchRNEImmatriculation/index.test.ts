import path from 'path';
import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { Siren } from '#utils/helpers';

describe('fetchRNEImmatriculation', () => {
  it('Should match snapshot for protected uniteLegale with the characteristics (PROTECTED)', async () => {
    const args = ['908595879' as Siren] as const;
    const result = await fetchRNEImmatriculation(...args);
    expect(JSON.stringify({ args, result }, null, 2)).toMatchFile(
      path.join(__dirname, './protected.json')
    );
  });

  it('Should match snapshot for protected uniteLegale with the characteristics (RGE)', async () => {
    const args = ['528163777' as Siren] as const;
    const result = await fetchRNEImmatriculation(...args);
    expect(JSON.stringify({ args, result }, null, 2)).toMatchFile(
      path.join(__dirname, './rge.json')
    );
  });
});
