import { HttpNotFound } from '#clients/exceptions';
import { Loader } from '#components-ui/loader';
import { INPI, INSEE } from '#components/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { hasAnyError, isDataLoading } from '#models/data-fetching';
import { useTimeout } from 'hooks';
import { IDirigeantsFetching } from '.';

const NoDirigeantDefault = () => (
  <p>
    Cette structure n’a pas de dirigeant(e) enregistré(e), que ce soit auprès de
    l’
    <INSEE /> ou auprès de l’
    <INPI />.
  </p>
);

type IDirigeantSummaryProps = {
  dirigeants: IDirigeantsFetching;
  uniteLegale: IUniteLegale;
};

const DirigeantSummary: React.FC<IDirigeantSummaryProps> = ({
  uniteLegale,
  dirigeants,
}) => {
  const summaries = [];
  const after100ms = useTimeout(100);
  if (isDataLoading(dirigeants)) {
    if (!after100ms) {
      return null;
    }
    summaries.push(
      <span>
        chargement des données des dirigeants en cours <Loader />
      </span>
    );
  } else {
    if (!hasAnyError(dirigeants)) {
      const dirigeantsCount = (dirigeants.data || []).length;
      summaries.push(
        <a href="#rne-dirigeants">
          {dirigeantsCount} dirigeants inscrits au Registre National des
          Entreprises (RNE)
        </a>
      );

      summaries.push(
        <a href="#beneficiaires">Liste des bénéficiaires effectifs</a>
      );
    }
  }

  const hasNoDirigeant = summaries.length === 0;
  if (hasNoDirigeant) {
    if (uniteLegale.association.idAssociation) {
      return null;
    } else if (
      isAPINotResponding(dirigeants) &&
      !(dirigeants instanceof HttpNotFound)
    ) {
      return null;
    }
    return <NoDirigeantDefault />;
  }

  return (
    <nav role="navigation" aria-labelledby="dirigeant-summary-title">
      <strong id="dirigeant-summary-title">
        Informations disponibles sur les dirigeant(s) :
      </strong>
      <ul>
        {summaries.map((summary, index) => (
          <li key={index}>{summary}</li>
        ))}
      </ul>
      <br />
    </nav>
  );
};

export default DirigeantSummary;
