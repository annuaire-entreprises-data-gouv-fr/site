import path from 'path';
import { Siren } from '#utils/helpers';
import { clientEntrepreneurSpectacles } from '..';

describe('clientEntrepreneurSpectacles', () => {
  it('Should match snapshot', async () => {
    const args = ['842019051' as Siren] as const;
    const result = await clientEntrepreneurSpectacles(...args);

    expect(JSON.stringify({ args, result }, null, 2)).toMatchFile(
      path.join(__dirname, './entrepreneur-spectacles.json')
    );
  });
});
