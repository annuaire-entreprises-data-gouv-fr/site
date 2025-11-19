import { getAgentAssociationProtectedFetcher } from "server-fetch/agent";
import AgentWallAssociationProtected from "#components/espace-agent-components/agent-wall/association";
import { AsyncDataSectionServer } from "#components/section/data-section/server";
import { EAdministration } from "#models/administrations/EAdministration";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { DirigeantsAssociationContent, NoDirigeants } from "./content";

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

/**
 * Dirigeants for agents : RNA or Le compte asso
 */
function DirigeantsAssociationSection({ uniteLegale, session }: IProps) {
  const associationProtected = getAgentAssociationProtectedFetcher(
    uniteLegale.siren,
    session
  );

  return (
    <AsyncDataSectionServer
      ContentComponent={DirigeantsAssociationContent}
      data={associationProtected}
      id="rna-dirigeants"
      isProtected
      notFoundInfo={<NoDirigeants />}
      otherContentProps={{}}
      sources={[EAdministration.MI, EAdministration.DJEPVA]}
      title="Dirigeants des associations"
      unauthorizedContent={
        <AgentWallAssociationProtected
          id="dirigeants"
          title="Dirigeants des associations"
          uniteLegale={uniteLegale}
        />
      }
    />
  );
}

export default DirigeantsAssociationSection;
