import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import AvisSituationLink from '../avis-situation-link';
import ButtonLink from '../button';
import SectionDashboard from '../section-dashboard';
import { TwoColumnTable } from '../table/simple';

const DashboardJuridiques: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    [
      'Statuts',
      <a key="stat" href="test">
        Télécharger
      </a>,
    ],
  ];
  return (
    <SectionDashboard title="Documents juridiques">
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

export default DashboardJuridiques;
