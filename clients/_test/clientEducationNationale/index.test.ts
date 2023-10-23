import { clientEducationNationale } from '#clients/education-nationale';
import { Siren } from '#utils/helpers';
import { expectClientToMatchSnapshot } from '../expect-client-to-match-snapshot';

describe('clientEducationNationale', () => {
  it('Should match snapshot', async () => {
    await expectClientToMatchSnapshot({
      client: clientEducationNationale,
      args: ['198100125' as Siren, 1],
      snaphotFile: 'lycée-jean-jaurès-carmaux.json',
      __dirname,
    });
  });
});
