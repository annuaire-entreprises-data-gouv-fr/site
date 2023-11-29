import { clientTVA } from '#clients/api-vies';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientTVA', () => {
  it('Should match snapshot', async () => {
    const testValues = [
      ['11198100125', 'tva-11198100125.json'],
      ['29528163777', 'tva-29528163777.json'],
      ['27552032534', 'tva-27552032534.json'],
      ['39356000000', 'tva-39356000000.json'],
      ['43842019051', 'tva-43842019051.json'],
      ['45300025764', 'tva-45300025764.json'],
    ];
    for (let [arg, file] of testValues) {
      await expectClientToMatchSnapshot({
        client: clientTVA,
        args: [arg],
        __dirname,
        snaphotFile: file,
      });
    }
  });
});
