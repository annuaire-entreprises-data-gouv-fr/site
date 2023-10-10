import { clientAssociation } from '#clients/api-proxy/association';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientAssociation', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientAssociation,
      args: ['842019051' as Siren, '84201905100015'],
      snaphotFile: 'association.json',
      __dirname,
    });
  });
});
