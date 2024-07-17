import { HttpNotFound } from '#clients/exceptions';
import { Icon } from '#components-ui/icon/wrapper';
import { Loader } from '#components-ui/loader';
import { INPI, INSEE, MI } from '#components/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import {
  IDataFetchingState,
  hasAnyError,
  isDataLoading,
} from '#models/data-fetching';
import { IImmatriculationRNE } from '#models/immatriculation';
import { useTimeout } from 'hooks';

const NoDirigeantAssociation = ({ idAssociation = '' }) => (
  <>
    <p>
      Cette association n’a pas de dirigeant(e) enregistré(e) auprès de l’
      <INSEE /> ou auprès de l’
      <INPI />
    </p>
    <p>
      Si des dirigeants ont été déclarés auprès du <MI /> vous les retrouverez
      sur l&apos;onglet “personnes physiques“ de{' '}
      <a
        target="_blank"
        href={`https://www.data-asso.fr/annuaire/association/${idAssociation}?docFields=documentsDac,documentsRna`}
        rel="noopener noreferrer"
      >
        sa fiche data-asso
      </a>
      .
    </p>
  </>
);

const NoDirigeantDefault = () => (
  <p>
    Cette structure n’a pas de dirigeant(e) enregistré(e), que ce soit auprès de
    l’
    <INSEE /> ou auprès de l’
    <INPI />.
  </p>
);

type IDirigeantSummaryProps = {
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IDataFetchingState;
  uniteLegale: IUniteLegale;
};

const DirigeantSummary: React.FC<IDirigeantSummaryProps> = ({
  uniteLegale,
  immatriculationRNE,
}) => {
  const summaries = [];
  const after100ms = useTimeout(100);
  if (isDataLoading(immatriculationRNE)) {
    if (!after100ms) {
      return null;
    }
    summaries.push(
      <span>
        chargement des données des dirigeants en cours <Loader />
      </span>
    );
  } else {
    if (!hasAnyError(immatriculationRNE)) {
      const dirigeantsCount = (immatriculationRNE?.dirigeants || []).length;
      summaries.push(
        <a href="#rne-dirigeants">
          {dirigeantsCount} dirigeants inscrits au Registre National des
          Entreprises (RNE)
        </a>
      );

      const beneficiairesCount = (immatriculationRNE?.beneficiaires || [])
        .length;
      summaries.push(
        <a href="#beneficiaires">
          <Icon slug="alertFill" color="#ff9c00">
            {beneficiairesCount} bénéficiaires inscrits à Référentiel des
            Bénéficiaires Effectifs
          </Icon>
        </a>
      );
    }
  }

  const hasNoDirigeant = summaries.length === 0;
  if (hasNoDirigeant) {
    if (uniteLegale.association.idAssociation) {
      return (
        <NoDirigeantAssociation
          idAssociation={uniteLegale.association.idAssociation}
        />
      );
    } else if (
      isAPINotResponding(immatriculationRNE) &&
      !(immatriculationRNE instanceof HttpNotFound)
    ) {
      return null;
    }
    return <NoDirigeantDefault />;
  }

  return (
    <>
      Cette structure possède :
      <ul>
        {summaries.map((summary, index) => (
          <li key={index}>{summary}</li>
        ))}
      </ul>
      <br />
    </>
  );
};

export default DirigeantSummary;
