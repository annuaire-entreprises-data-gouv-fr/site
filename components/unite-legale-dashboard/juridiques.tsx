import { IUniteLegale } from '../../models';
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
    </SectionDashboard>
  );
};

export default DashboardJuridiques;
