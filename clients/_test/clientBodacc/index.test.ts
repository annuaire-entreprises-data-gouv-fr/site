import clientBodacc from '#clients/open-data-soft/clients/bodacc';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientBODACC', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientBodacc,
      args: ['880878145' as Siren],
      snaphotFile: 'ganymede-bodacc.json',
      __dirname,
    });
  });
});
