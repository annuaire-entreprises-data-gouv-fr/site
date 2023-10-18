import { clientEgapro } from '#clients/egapro';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEgapro', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientEgapro,
      args: ['356000000' as Siren],
      snaphotFile: 'egapro-laposte.json',
      __dirname,
    });
  });
});
