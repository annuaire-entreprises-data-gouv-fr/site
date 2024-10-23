import AgentWallAssociationProtected from '#components/espace-agent-components/agent-wall/association';
import AgentWallDocuments from '#components/espace-agent-components/agent-wall/document';
import { IUniteLegale, isAssociation } from '#models/core/types';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { AgentActesAssociation } from './associations';
import { AgentActesRNE } from './rne';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, ApplicationRights.actesRne)) {
    if (isAssociation(uniteLegale)) {
      return (
        <AgentWallAssociationProtected
          title="Actes et statuts des associations"
          id="actes"
          uniteLegale={uniteLegale}
        />
      );
    }
    return (
      <AgentWallDocuments
        title="Actes et statuts"
        id="actes"
        uniteLegale={uniteLegale}
      />
    );
  }

  return (
    <>
      {isAssociation(uniteLegale) && (
        <AgentActesAssociation uniteLegale={uniteLegale} session={session} />
      )}
      <AgentActesRNE uniteLegale={uniteLegale} session={session} />
    </>
  );
};
export default ActesSection;
