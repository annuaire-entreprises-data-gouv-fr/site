import { ISession } from '#models/authentication/user/session';
import { IUniteLegale, isAssociation } from '#models/core/types';
import AvisSituationSection from './insee';
import { JustificatifImmatriculationJOAFE } from './joafe';
import { JustificatifImmatriculationRNE } from './rne';

const JustificatifsSection: React.FC<{
  uniteLegale: IUniteLegale;
  session: ISession | null;
}> = ({ uniteLegale, session }) => {
  return (
    <>
      {isAssociation(uniteLegale) && (
        <JustificatifImmatriculationJOAFE uniteLegale={uniteLegale} />
      )}
      {uniteLegale.dateMiseAJourInpi && (
        <JustificatifImmatriculationRNE
          uniteLegale={uniteLegale}
          session={session}
        />
      )}
      <AvisSituationSection uniteLegale={uniteLegale} session={session} />
    </>
  );
};
export default JustificatifsSection;
