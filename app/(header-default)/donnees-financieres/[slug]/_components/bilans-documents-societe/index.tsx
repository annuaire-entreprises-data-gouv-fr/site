import AgentWallDocuments from "#components/espace-agent-components/agent-wall/document";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import AgentBilansSection from "./protected-bilans-documents-societe";

export function BilansDocumentsSociete({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  if (!hasRights(session, ApplicationRights.bilansRne)) {
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
      <AgentBilansSection session={session} uniteLegale={uniteLegale} />
    </>
  );
}
