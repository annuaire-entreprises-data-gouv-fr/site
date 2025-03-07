import { clientAnnuaireServicePublicBySiret } from '#clients/open-data-soft/clients/annuaire-service-public';
import { Siret } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEntrepreneurSpectacles', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientAnnuaireServicePublicBySiret,
      args: ['13002526500013' as Siret],
      __dirname,
      snapshotFile: 'dinum.json',
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
});
