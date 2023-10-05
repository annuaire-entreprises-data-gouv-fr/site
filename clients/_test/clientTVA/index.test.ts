import { clientTVA } from '#clients/api-proxy/tva';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientTVA', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientTVA,
      args: ['29528163777'],
      __dirname,
      snaphotFile: 'tva.json',
    });
  });
});
