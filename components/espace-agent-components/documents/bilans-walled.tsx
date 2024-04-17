import { IUniteLegale } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { default as AgentWallWrapper } from '../agent-wall/wrapper';
import AgentBilansSection from './data-section/bilans';

const BilansSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  return (
    <AgentWallWrapper
      title="Bilans"
      id="bilans"
      uniteLegale={uniteLegale}
      condition={!hasRights(session, EScope.bilansRne)}
    >
      <AgentBilansSection uniteLegale={uniteLegale} />
    </AgentWallWrapper>
  );
};

export default BilansSection;
