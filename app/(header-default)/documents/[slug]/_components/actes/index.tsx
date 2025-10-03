import AgentWallAssociationProtected from "#components/espace-agent-components/agent-wall/association";
import AgentWallDocuments from "#components/espace-agent-components/agent-wall/document";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { type IUniteLegale, isAssociation } from "#models/core/types";
import { AgentActesAssociation } from "./associations";
import { AgentActesRNE } from "./rne";

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  if (!hasRights(session, ApplicationRights.actesRne)) {
    if (isAssociation(uniteLegale)) {
      return (
        <AgentWallAssociationProtected
          id="actes"
          title="Actes et statuts des associations"
          uniteLegale={uniteLegale}
        />
      );
    }
    return (
      <AgentWallDocuments
        id="actes"
        title="Actes et statuts"
        uniteLegale={uniteLegale}
      />
    );
  }

  return (
    <>
      {isAssociation(uniteLegale) && (
        <AgentActesAssociation session={session} uniteLegale={uniteLegale} />
      )}
      <AgentActesRNE session={session} uniteLegale={uniteLegale} />
    </>
  );
};
export default ActesSection;
