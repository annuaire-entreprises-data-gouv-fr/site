import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import AvisSituationLink from '../avis-situation-link';
import ButtonLink from '../button';
import SectionDashboard from '../section-dashboard';
import { TwoColumnTable } from '../table/simple';

const DashboardJustificatifs: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['Type', 'Commerciale'],
    [
      'Extrait Inpi',
      <a key="inpi" href="test">
        Télécharger
      </a>,
    ],
    [
      'Extrait D1',
      <a key="cma" href="test">
        Télécharger
      </a>,
    ],
    [
      'Association',
      <a key="asso" href="test">
        Télécharger
      </a>,
    ],
    [
      'Avis Insee',
      <AvisSituationLink key="avis-situation" siren={uniteLegale.siren} />,
    ],
  ];
  return (
    <SectionDashboard title="Justificatifs d’existence">
      <TwoColumnTable body={data} />
      <br />
      <div className="layout-center">
        <ButtonLink to={`/justificatif/${uniteLegale.siren}`} alt small>
          → Tout voir
        </ButtonLink>
      </div>
    </SectionDashboard>
  );
};

export default DashboardJustificatifs;
