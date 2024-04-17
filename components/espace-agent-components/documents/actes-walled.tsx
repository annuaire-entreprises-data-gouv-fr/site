import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentWallWrapper from '../agent-wall/wrapper';
import { AgentActesSection } from './data-section/actes';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => (
  <AgentWallWrapper
    title="Actes et statuts"
    id="actes"
    uniteLegale={uniteLegale}
    condition={!hasRights(session, EScope.actesRne)}
  >
    <AgentActesSection uniteLegale={uniteLegale} />
  </AgentWallWrapper>
);

export default ActesSection;
