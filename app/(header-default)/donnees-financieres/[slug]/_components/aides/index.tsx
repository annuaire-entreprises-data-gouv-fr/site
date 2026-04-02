import AgentWallDocuments from "#components/espace-agent-components/agent-wall/document";
import { Section } from "#components/section";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import {
  hasAidesMinimisRenseignees,
  type IUniteLegale,
} from "#models/core/types";
import AidesMinimisProtected from "./protected-aides-minimis";

export function AidesMinimis({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  if (!hasRights(session, ApplicationRights.isAgent)) {
    return (
      <AgentWallDocuments
        id="aides-minimis"
        title="Aides Minimis"
        uniteLegale={uniteLegale}
      />
    );
  }

  if (!hasAidesMinimisRenseignees(uniteLegale)) {
    return (
      <Section
        id="aides-minimis"
        isProtected
        sources={[EAdministration.DINUM]}
        title="Aides Minimis"
      >
        <p>
          Les données relatives aux aides de minimis ne sont pas disponibles
          pour cette entreprise, le jeu de données étant incomplet.
        </p>
      </Section>
    );
  }

  return <AidesMinimisProtected session={session} uniteLegale={uniteLegale} />;
}
