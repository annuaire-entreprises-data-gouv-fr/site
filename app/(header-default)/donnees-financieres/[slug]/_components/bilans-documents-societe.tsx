import AgentWallDocuments from '#components/espace-agent-components/agent-wall/document';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import { IUniteLegale } from '#models/core/types';
import AgentBilansSection from './bilans-documents-societe-protected';

export default function BilansDocumentsSociete({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) {
  if (!hasRights(session, ApplicationRights.bilansRne)) {
    return (
      <AgentWallDocuments
        title="Bilans"
        id="bilans"
        uniteLegale={uniteLegale}
      />
    );
  }
  return <AgentBilansSection uniteLegale={uniteLegale} session={session} />;
}
