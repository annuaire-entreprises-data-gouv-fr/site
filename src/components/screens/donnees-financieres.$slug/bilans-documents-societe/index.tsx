import AgentWallDocuments from "#/components/espace-agent-components/agent-wall/document";
import { HorizontalSeparator } from "#/components-ui/horizontal-separator";
import type { IAgentInfo } from "#/models/authentication/agent";
import {
  ApplicationRights,
  hasRights,
} from "#/models/authentication/user/rights";
import type { IUniteLegale } from "#/models/core/types";
import AgentBilansSection from "./protected-bilans-documents-societe";

export function BilansDocumentsSociete({
  uniteLegale,
  user,
}: {
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}) {
  if (!hasRights({ user }, ApplicationRights.bilansRne)) {
    return (
      <>
        <HorizontalSeparator />
        <AgentWallDocuments
          id="bilans-pdf"
          title="Bilans au format PDF"
          uniteLegale={uniteLegale}
        />
      </>
    );
  }
  return (
    <>
      <HorizontalSeparator />
      <AgentBilansSection uniteLegale={uniteLegale} user={user} />
    </>
  );
}
