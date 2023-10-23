import { clientOrganismeFormation } from '#clients/open-data-soft/clients/qualiopi';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientOrganismeFormation', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientOrganismeFormation,
      args: ['356000000' as Siren],
      __dirname,
      snaphotFile: 'qualiopi-laposte.json',
      postProcessResult: (result) => {
        result.lastModified = '2023-10-18T23:19:19.590091+00:00';
      },
    });
  });
});
