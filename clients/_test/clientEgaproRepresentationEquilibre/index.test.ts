import { clientEgaproRepresentationEquilibre } from '#clients/egapro/representationEquilibre';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEgaproRepresentationEquilibre', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientEgaproRepresentationEquilibre,
      args: ['356000000' as Siren],
      snaphotFile: 'egapro-laposte.json',
      __dirname,
    });
  });
});
