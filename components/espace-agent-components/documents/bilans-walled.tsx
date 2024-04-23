import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentWallDocuments from '../agent-wall/document';
import AgentBilansSection from './data-section/bilans';

const BilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) =>
  !hasRights(session, EScope.bilansRne) ? (
    <AgentWallDocuments
      title="Bilans"
      id="bilans"
      uniteLegale={uniteLegale}
      condition={!hasRights(session, EScope.bilansRne)}
    />
  ) : (
    <AgentBilansSection uniteLegale={uniteLegale} />
  );

export default BilansSection;
