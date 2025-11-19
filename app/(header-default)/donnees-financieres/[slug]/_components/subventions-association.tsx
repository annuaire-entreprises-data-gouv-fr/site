import { getAgentSubventionsAssociationFetcher } from "server-fetch/agent";
import AgentWall from "#components/espace-agent-components/agent-wall";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IAssociation } from "#models/core/types";
import SubventionsAssociationContent from "./subventions-association-content";

export default function SubventionsAssociationSection({
  uniteLegale,
  session,
}: {
  uniteLegale: IAssociation;
  session: ISession | null;
}) {
  const subventions = getAgentSubventionsAssociationFetcher(
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionServer
      ContentComponent={SubventionsAssociationContent}
      data={subventions}
      id="detail-des-subventions"
      isProtected
      notFoundInfo="Aucune demande de subvention n’a été trouvée pour cette association."
      otherContentProps={{ uniteLegale }}
      sources={[EAdministration.DJEPVA]}
      title="Subventions reçues"
      unauthorizedContent={
        <AgentWall id="detail-des-subventions" title="Subventions reçues" />
      }
    />
  );
}
