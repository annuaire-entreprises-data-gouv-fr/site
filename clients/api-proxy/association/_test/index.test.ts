import path from 'path';
import { Siren } from '#utils/helpers';
import { clientAssociation } from '..';

describe('clientAssociation', () => {
  it('Should match snapshot', async () => {
    const args = ['842019051' as Siren, '84201905100015'] as const;
    const result = await clientAssociation(...args);
    expect(JSON.stringify({ args, result }, null, 2)).toMatchFile(
      path.join(__dirname, './association.json')
    );
  });
});
