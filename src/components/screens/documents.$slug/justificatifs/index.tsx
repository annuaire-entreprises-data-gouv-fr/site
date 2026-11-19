import type { IAgentInfo } from "#/models/authentication/agent";
import { type IUniteLegale, isAssociation } from "#/models/core/types";
import AvisSituationSection from "./insee";
import { JustificatifImmatriculationJOAFE } from "./joafe";
import { JustificatifImmatriculationRNE } from "./rne";

const JustificatifsSection: React.FC<{
  isLegacyProtected: boolean | null;
  uniteLegale: IUniteLegale;
  user: IAgentInfo | null;
}> = ({ isLegacyProtected, uniteLegale, user }) => (
  <>
    {isAssociation(uniteLegale) && (
      <JustificatifImmatriculationJOAFE uniteLegale={uniteLegale} />
    )}
    {uniteLegale.dateMiseAJourInpi && (
      <JustificatifImmatriculationRNE uniteLegale={uniteLegale} user={user} />
    )}
    <AvisSituationSection
      isLegacyProtected={isLegacyProtected}
      uniteLegale={uniteLegale}
      user={user}
    />
  </>
);
export default JustificatifsSection;
