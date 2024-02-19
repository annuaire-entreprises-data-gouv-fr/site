import { fetchRNEImmatriculation } from '#clients/api-proxy/rne';
import { IImmatriculationRNE } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

const TIMEOUT_RNE = 90000;

function postProcessResult(result: IImmatriculationRNE) {
  if (result.metadata.isFallback) {
    throw new Error(
      'RNE : official API is down, skipping the test of the fallback version'
    );
  }
}

describe('fetchRNEImmatriculation', () => {
  it(
    'Should match snapshot for protected uniteLegale with the characteristics (PROTECTED)',
    async () => {
      await expectClientToMatchSnapshot({
        client: fetchRNEImmatriculation,
        args: ['908595879' as Siren],
        __dirname,
        postProcessResult,
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
        postProcessResult,
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
        postProcessResult,
        snaphotFile: 'siret-356000000.json',
      });
    },
    TIMEOUT_RNE
  );
});
