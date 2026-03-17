import AgentWallDocuments from "#components/espace-agent-components/agent-wall/document";
import { HorizontalSeparator } from "#components-ui/horizontal-separator";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
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
      <>
        <HorizontalSeparator />
        <AgentWallDocuments
          id="aides-minimis"
          title="Aides Minimis"
          uniteLegale={uniteLegale}
        />
      </>
    );
  }
  return (
    <>
      <HorizontalSeparator />
      <AidesMinimisProtected session={session} uniteLegale={uniteLegale} />
    </>
  );
}
