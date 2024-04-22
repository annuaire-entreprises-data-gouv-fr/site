import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentWallDocuments from '../agent-wall/document';
import { AgentActesSection } from './data-section/actes';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) =>
  !hasRights(session, EScope.actesRne) ? (
    <AgentWallDocuments
      title="Actes et statuts"
      id="actes"
      uniteLegale={uniteLegale}
      condition={!hasRights(session, EScope.actesRne)}
    />
  ) : (
    <AgentActesSection uniteLegale={uniteLegale} />
  );

export default ActesSection;
