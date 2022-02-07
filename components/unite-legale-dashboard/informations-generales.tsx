import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import ButtonLink from '../button';
import IsActiveTag from '../is-active-tag';
import SectionDashboard from '../section-dashboard';
import { TwoColumnTable } from '../table/simple';

const DashboardInformationsGenerales: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['État', <IsActiveTag key="actif" isActive={uniteLegale.estActive} />],
    ['Siren', formatIntFr(uniteLegale.siren)],
    ['Siret', formatSiret(uniteLegale.siege.siret)],
    ['N° TVA', formatIntFr(uniteLegale.numeroTva)],
  ];
  return (
    <SectionDashboard title="Informations générales">
      <TwoColumnTable body={data} />
      <br />
      <div className="layout-center">
        <ButtonLink to={`/entreprise/${uniteLegale.siren}`} alt small>
          → Tout voir
        </ButtonLink>
      </div>
    </SectionDashboard>
  );
};

export default DashboardInformationsGenerales;
