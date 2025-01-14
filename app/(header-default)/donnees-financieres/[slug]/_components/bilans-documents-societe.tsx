import AgentWallDocuments from '#components/espace-agent-components/agent-wall/document';
import { IUniteLegale } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentBilansSection from './bilans-documents-societe-protected';

const BilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, ApplicationRights.bilansRne)) {
    return (
      <AgentWallDocuments
        title="Bilans"
        id="bilans"
        uniteLegale={uniteLegale}
      />
    );
  }
  return <AgentBilansSection uniteLegale={uniteLegale} session={session} />;
};

export default BilansSection;
