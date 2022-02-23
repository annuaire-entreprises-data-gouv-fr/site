import { IUniteLegale } from '../../models';
import { formatIntFr } from '../../utils/helpers/formatting';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
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
    <SectionDashboard
      title="Informations générales"
      moreTo={`/entreprise/${uniteLegale.siren}`}
    >
      <TwoColumnTable body={data} />
    </SectionDashboard>
  );
};

export default DashboardInformationsGenerales;
