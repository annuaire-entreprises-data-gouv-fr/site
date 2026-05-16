import AgentWallDocuments from "#/components/espace-agent-components/agent-wall/document";
import { Section } from "#/components/section";
import { EAdministration } from "#/models/administrations/EAdministration";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import { hasAidesMinimis, type IUniteLegale } from "#/models/core/types";
import AidesMinimisProtected from "./protected-aides-minimis";

export function AidesMinimis({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  if (!hasRights({ user }, ApplicationRights.isAgent)) {
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

  return <AidesMinimisProtected uniteLegale={uniteLegale} />;
}
