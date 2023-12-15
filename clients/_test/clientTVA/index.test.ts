import { clientTVA } from '#clients/api-vies';
import { TVANumber } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientTVA', () => {
  it('Should match snapshot', async () => {
    const testValues = [
      // '11198100125',
      // '29528163777',
      // '27552032534',
      // '39356000000',
      '43842019051',
      '72217500016',
    ];
    for (let arg of testValues) {
      await expectClientToMatchSnapshot({
        client: clientTVA,
        args: [arg as TVANumber],
        __dirname,
        snaphotFile: `tva-${arg}.json`,
      });
    }
  });
});
