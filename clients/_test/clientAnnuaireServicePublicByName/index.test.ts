import { clientAnnuaireServicePublicByName } from '#clients/open-data-soft/clients/annuaire-service-public';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEntrepreneurSpectacles', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientAnnuaireServicePublicByName,
      args: ['DIRECTION INTERMINISTERIELLE DU NUMERIQUE (DINUM)' as Siren],
      __dirname,
      snaphotFile: 'dinum.json',
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
});
