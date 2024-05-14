import { HttpNotFound } from '#clients/exceptions';
import { Loader } from '#components-ui/loader';
import { INPI, INSEE, MI } from '#components/administrations';
import { isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IImmatriculationRNE } from '#models/immatriculation';

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
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
};

const DirigeantSummary: React.FC<IDirigeantSummaryProps> = async ({
  uniteLegale,
  immatriculationRNE,
}) => {
  const summaries = [];

  if (!isAPINotResponding(immatriculationRNE)) {
    const dirigeantsCount = (immatriculationRNE?.dirigeants || []).length;
    summaries.push(
      <a href="#rne-dirigeants">
        {dirigeantsCount} dirigeants inscrits au Registre National des
        Entreprises (RNE)
      </a>
    );

    const beneficiairesCount = (immatriculationRNE?.beneficiaires || []).length;
    summaries.push(
      <a href="#beneficiaires">
        {beneficiairesCount} bénéficiaires inscrits à Référentiel des
        Bénéficiaires Effectifs
      </a>
    );
  }
  if (isAPILoading(immatriculationRNE)) {
    summaries.push(
      <span>
        chargement des données des dirigeants en cours <Loader />
      </span>
    );
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
