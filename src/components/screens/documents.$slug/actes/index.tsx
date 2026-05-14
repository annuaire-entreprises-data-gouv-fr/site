import AgentWallAssociationProtected from "#/components/espace-agent-components/agent-wall/association";
import AgentWallDocuments from "#/components/espace-agent-components/agent-wall/document";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { type IUniteLegale, isAssociation } from "#/models/core/types";
import { AgentActesAssociation } from "./associations";
import { AgentActesRNE } from "./rne";

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ uniteLegale, user }) => {
  if (!hasRights({ user }, ApplicationRights.actesRne)) {
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
        <AgentActesAssociation uniteLegale={uniteLegale} user={user} />
      )}
      <AgentActesRNE uniteLegale={uniteLegale} user={user} />
    </>
  );
};
export default ActesSection;
