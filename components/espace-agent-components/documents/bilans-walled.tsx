import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentWallDocuments from '../agent-wall/document';
import AgentBilansSection from './data-section/bilans';

const BilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, EScope.bilansRne)) {
    return (
      <AgentWallDocuments
        title="Bilans"
        id="bilans"
        uniteLegale={uniteLegale}
      />
    );
  }
  return <AgentBilansSection uniteLegale={uniteLegale} />;
};

export default BilansSection;
