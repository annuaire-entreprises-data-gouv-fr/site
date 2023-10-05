import path from 'path';
import { clientTVA } from '#clients/api-proxy/tva';

describe('clientTVA', () => {
  it('Should match snapshot', async () => {
    const args = ['29528163777'] as const;
    const result = await clientTVA(...args);
    expect(JSON.stringify({ args, result }, null, 2)).toMatchFile(
      path.join(__dirname, './tva.json')
    );
  });
});
