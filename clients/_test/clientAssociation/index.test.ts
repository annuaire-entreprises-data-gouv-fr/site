import { clientAssociation } from '#clients/api-proxy/association';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';
import simplifyParams from './simplify-params';

describe('clientAssociation', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientAssociation,
      args: ['800329849' as Siren, '80032984900023'],
      snaphotFile: 'association.json',
      simplifyParams,
      __dirname,
    });
  });
  it('Should match snapshot for association with bilans', async () => {
    await expectClientToMatchSnapshot({
      client: clientAssociation,
      args: ['338365059' as Siren, '33836505900017'],
      simplifyParams,
      snaphotFile: 'association-with-bilans.json',
      __dirname,
    });
  });
});
