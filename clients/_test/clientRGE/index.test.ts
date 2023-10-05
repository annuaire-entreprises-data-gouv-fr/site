import { clientRGE } from '#clients/rge';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientRGE', () => {
  it('Should match snapshot', async () => {
    expectClientToMatchSnapshot({
      client: clientRGE,
      args: ['528163777' as Siren],
      __dirname,
      snaphotFile: 'rge.json',
    });
  });
});
