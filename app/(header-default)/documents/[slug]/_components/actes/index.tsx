import AgentWallDocuments from '#components/espace-agent-components/agent-wall/document';
import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { AgentActesRNE } from './actes-rne';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, EScope.actesRne)) {
    return (
      <AgentWallDocuments
        title="Actes et statuts"
        id="actes"
        uniteLegale={uniteLegale}
      />
    );
  }
  return <AgentActesRNE uniteLegale={uniteLegale} session={session} />;
};
export default ActesSection;
