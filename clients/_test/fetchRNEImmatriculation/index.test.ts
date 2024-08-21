import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { fetchRNEImmatriculationFallback } from '#clients/api-proxy/rne/fallback';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

const TIMEOUT_RNE = 90000;

describe('fetchRNEImmatriculation', () => {
  it(
    'Should match snapshot for protected uniteLegale with the characteristics (PROTECTED)',
    async () => {
      await expectClientToMatchSnapshot({
        client: fetchRNEImmatriculation,
        args: ['908595879' as Siren],
        __dirname,
        snaphotFile: 'protected.json',
      });
    },
    TIMEOUT_RNE
  );

  it(
    'Should match snapshot for protected uniteLegale with the characteristics (RGE)',
    async () => {
      await expectClientToMatchSnapshot({
        client: fetchRNEImmatriculation,
        args: ['487444697' as Siren],
        __dirname,
        snaphotFile: 'rge.json',
      });
    },
    TIMEOUT_RNE
  );

  it(
    'Should match snapshot for 356000000 siret',
    async () => {
      await expectClientToMatchSnapshot({
        client: fetchRNEImmatriculation,
        args: ['356000000' as Siren],
        __dirname,
        snaphotFile: 'siret-356000000.json',
      });
    },
    TIMEOUT_RNE
  );
});

describe('fetchRNEImmatriculationFallback', () => {
  it(
    'Should match snapshot for protected uniteLegale with the characteristics (RGE)',
    async () => {
      await expectClientToMatchSnapshot({
        client: fetchRNEImmatriculationFallback,
        args: ['487444697' as Siren],
        __dirname,
        snaphotFile: 'rge.json',
      });
    },
    TIMEOUT_RNE
  );
});
