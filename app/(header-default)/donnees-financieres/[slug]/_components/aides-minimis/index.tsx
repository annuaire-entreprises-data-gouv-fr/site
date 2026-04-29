import AgentWallDocuments from "#components/espace-agent-components/agent-wall/document";
import { Section } from "#components/section";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import { hasAidesMinimis, type IUniteLegale } from "#models/core/types";
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

  if (!hasAidesMinimis(uniteLegale)) {
    return (
      <Section
        id="aides-minimis"
        isProtected
        sources={[EAdministration.DINUM]}
        title="Aides Minimis"
      >
        <p>
          En raison de l’incomplétude du jeu de données, il est impossible de
          savoir si cette entreprise a reçu des aides de Minimis.
        </p>
      </Section>
    );
  }

  return <AidesMinimisProtected session={session} uniteLegale={uniteLegale} />;
}
