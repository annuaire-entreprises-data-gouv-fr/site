import routes from '../../clients/routes';
import DownloadLink from '../download-link';
import { IUniteLegale } from '../../models';
import SectionDashboard from '../section-dashboard';
import { TwoColumnTable } from '../table/simple';

const DashboardAttestations: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    [
      'Sociales (Urssaf)',
      <DownloadLink
        key="ussaf"
        to={`${routes.sireneInsee.avis}${uniteLegale.siege.siret}`}
      />,
    ],
    [
      'Fiscales (Dgfip)',
      <DownloadLink
        key="dgfip"
        to={`${routes.sireneInsee.avis}${uniteLegale.siege.siret}`}
      />,
    ],
  ];
  return (
    <SectionDashboard title="Attestations de cotisations">
      <TwoColumnTable body={data} />
    </SectionDashboard>
  );
};

export default DashboardAttestations;
