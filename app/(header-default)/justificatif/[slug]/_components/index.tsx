import { IUniteLegale } from '#models/core/types';
import getImmatriculationRNE from '#models/immatriculation/rne';
import { ISession } from '#models/user/session';
import { IJustificatifs, ImmatriculationsSection } from './container';

const Immatriculations: React.FC<{
  uniteLegale: IUniteLegale;
  immatriculationJOAFE: IJustificatifs['immatriculationJOAFE'];
  session: ISession | null;
}> = async ({ uniteLegale, immatriculationJOAFE, session }) => {
  const immatriculationRNE = await getImmatriculationRNE(uniteLegale.siren);

  return (
    <ImmatriculationsSection
      uniteLegale={uniteLegale}
      immatriculationRNE={immatriculationRNE}
      immatriculationJOAFE={immatriculationJOAFE}
      session={session}
    />
  );
};

export default Immatriculations;
