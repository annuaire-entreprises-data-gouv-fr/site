import type { ISession } from "#models/authentication/user/session";
import { type IUniteLegale, isAssociation } from "#models/core/types";
import AvisSituationSection from "./insee";
import { JustificatifImmatriculationJOAFE } from "./joafe";
import { JustificatifImmatriculationRNE } from "./rne";

const JustificatifsSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => (
  <>
    {isAssociation(uniteLegale) && (
      <JustificatifImmatriculationJOAFE uniteLegale={uniteLegale} />
    )}
    {uniteLegale.dateMiseAJourInpi && (
      <JustificatifImmatriculationRNE
        session={session}
        uniteLegale={uniteLegale}
      />
    )}
    <AvisSituationSection session={session} uniteLegale={uniteLegale} />
  </>
);
export default JustificatifsSection;
