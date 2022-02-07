import { IUniteLegale } from '../../models';
import SectionDashboard from '../section-dashboard';
import { TwoColumnTable } from '../table/simple';

const DashboardAttestations: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    [
      'Vigilance',
      <a key="vigi" href="test">
        Télécharger
      </a>,
    ],
    [
      'Fiscale',
      <a key="fisc" href="test">
        Télécharger
      </a>,
    ],
  ];
  return (
    <SectionDashboard title="Attestations">
      <TwoColumnTable body={data} />
    </SectionDashboard>
  );
};

export default DashboardAttestations;
