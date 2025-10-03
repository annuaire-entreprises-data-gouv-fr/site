import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import AgentWallDocuments from "#components/espace-agent-components/agent-wall/document";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import { ISession } from "#models/authentication/user/session";
import { IUniteLegale } from "#models/core/types";
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
          title="Bilans au format PDF"
          id="bilans-pdf"
          uniteLegale={uniteLegale}
        />
      </>
    );
  }
  return (
    <>
      <HorizontalSeparator />
      <AgentBilansSection uniteLegale={uniteLegale} session={session} />
    </>
  );
}
