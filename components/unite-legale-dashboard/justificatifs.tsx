import { IUniteLegale } from '../../models';
import SectionDashboard from '../section-dashboard';
import { TwoColumnTable } from '../table/simple';
import DownloadLink from '../download-link';
import routes from '../../clients/routes';

const DashboardJustificatifs: React.FC<{
  uniteLegale: IUniteLegale;
}> = ({ uniteLegale }) => {
  const data = [
    ['Type', 'Commerciale'],
    [
      'Extrait Inpi',
      <DownloadLink
        key="inpi"
        to={`${routes.sireneInsee.avis}${uniteLegale.siege.siret}`}
      />,
    ],
    [
      'Extrait D1',
      <DownloadLink
        key="cma"
        to={`${routes.sireneInsee.avis}${uniteLegale.siege.siret}`}
      />,
    ],
    [
      'Inscription JOAFE',
      <DownloadLink
        key="asso"
        to={`${routes.sireneInsee.avis}${uniteLegale.siege.siret}`}
      />,
    ],
    [
      'Inscription Insee',
      <DownloadLink
        key="avis-situation"
        to={`${routes.sireneInsee.avis}${uniteLegale.siege.siret}`}
        label="Avis de situation"
      />,
    ],
  ];
  return (
    <SectionDashboard
      title="Justificatifs d’existence"
      moreTo={`/justificatif/${uniteLegale.siren}`}
    >
      <TwoColumnTable body={data} />
    </SectionDashboard>
  );
};

export default DashboardJustificatifs;
