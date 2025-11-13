import { getAgentAssociationProtectedFetcher } from "server-fetch/agent";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { AssociationsContent, NoDocument } from "./associations-content";

export const AgentActesAssociation: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  const associationProtected = getAgentAssociationProtectedFetcher(
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionServer
      ContentComponent={AssociationsContent}
      data={associationProtected}
      id="actes"
      isProtected
      notFoundInfo={<NoDocument />}
      otherContentProps={{}}
      sources={[EAdministration.MI, EAdministration.DJEPVA]}
      title="Actes et statuts"
    />
  );
};
