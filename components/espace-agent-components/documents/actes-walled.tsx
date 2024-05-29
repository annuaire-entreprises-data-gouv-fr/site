import { IUniteLegale } from '#models/core/types';
import { getDocumentsRNEProtected } from '#models/immatriculation/rne';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentWallDocuments from '../agent-wall/document';
import { AgentActesSection } from './data-section/actes';

const ActesSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = async ({ uniteLegale, session }) => {
  if (!hasRights(session, EScope.actesRne)) {
    return (
      <AgentWallDocuments
        title="Actes et statuts"
        id="actes"
        uniteLegale={uniteLegale}
        condition={!hasRights(session, EScope.actesRne)}
      />
    );
  }
  const documents = getDocumentsRNEProtected(uniteLegale.siren);
  return <AgentActesSection uniteLegale={uniteLegale} documents={documents} />;
};
export default ActesSection;
