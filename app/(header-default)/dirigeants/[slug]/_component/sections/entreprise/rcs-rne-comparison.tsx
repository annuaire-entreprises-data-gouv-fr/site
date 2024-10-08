import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import { INPI } from '#components/administrations';
import { IUniteLegale } from '#models/core/types';
import { isDataSuccess } from '#models/data-fetching';
import { IDirigeantsFetching } from '.';

function RCSRNEComparison({
  dirigeantsRNE,
  dirigeantsRCS,
  uniteLegale,
}: {
  dirigeantsRNE: IDirigeantsFetching;
  dirigeantsRCS: IDirigeantsFetching;
  uniteLegale: IUniteLegale;
}) {
  if (!isDataSuccess(dirigeantsRNE) || !isDataSuccess(dirigeantsRCS)) {
    return null;
  } else if (dirigeantsRNE.data.length === dirigeantsRCS.data.length) {
    return null;
  }

  return (
    <Warning>
      Les données d’Infogreffe sont issues du RNE mais il y a une différence
      entre le nombre de dirigeant(s) retourné(s) par l’
      <INPI />({dirigeantsRNE.data.length}) et par Infogreffe (
      {dirigeantsRCS.data.length}
      ). Pour comparer, vous pouvez consulter la page de cette entreprise sur{' '}
      <a
        rel="noopener"
        target="_blank"
        href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
        aria-label="Consulter la liste des dirigeants sur le site de l’INPI, nouvelle fenêtre"
      >
        data.inpi.fr
      </a>
      .
    </Warning>
  );
}

export default RCSRNEComparison;
