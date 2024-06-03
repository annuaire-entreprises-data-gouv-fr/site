import { IUniteLegale } from '#models/core/types';
import { getDocumentsRNEProtected } from '#models/immatriculation/rne';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import AgentWallDocuments from '../agent-wall/document';
import AgentBilansSection from './data-section/bilans';

const BilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = async ({ uniteLegale, session }) => {
  if (!hasRights(session, EScope.bilansRne)) {
    return (
      <AgentWallDocuments
        title="Bilans"
        id="bilans"
        uniteLegale={uniteLegale}
      />
    );
  }
  const documents = getDocumentsRNEProtected(uniteLegale.siren);
  return <AgentBilansSection uniteLegale={uniteLegale} documents={documents} />;
};

export default BilansSection;
