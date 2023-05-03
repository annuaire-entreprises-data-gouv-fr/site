import { INPI, INSEE, MI } from '#components/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { IDirigeants } from '#models/dirigeants';
import { isServicePublic } from '#models/index';

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
        rel="noreferrer"
      >
        sa fiche data-asso
      </a>
      .
    </p>
  </>
);

const NoDirigeantServicePublic = () => (
  <p>
    Les administrations centrales, ministères et autres services public,
    n&apos;ont pas de dirigeant(e) enregistré(e) dans les bases de données de l’
    <INSEE /> ou de <INPI />.
  </p>
);

const NoDirigeantDefault = () => (
  <p>
    Cette structure n’a pas de dirigeant(e) enregistré(e), que ce soit auprès de
    l’
    <INSEE /> ou auprès de l’
    <INPI />.
  </p>
);

const DirigeantSummary: React.FC<IDirigeants> = ({
  uniteLegale,
  immatriculationRNCS,
}) => {
  const summaries = [];
  const inseeDirigeant =
    uniteLegale.dirigeant && '1 dirigeant(e) inscrit(e) à l’Insee';

  if (inseeDirigeant) {
    summaries.push(<a href="#insee-dirigeant">{inseeDirigeant}</a>);
  }

  if (!isAPINotResponding(immatriculationRNCS)) {
    const dirigeantsCount = (immatriculationRNCS?.dirigeants || []).length;
    summaries.push(
      <a href="#rncs-dirigeants">
        {dirigeantsCount} dirigeants inscrits au Registre du Commerce et des
        Sociétés (RCS)
      </a>
    );

    const beneficiairesCount = (immatriculationRNCS?.beneficiaires || [])
      .length;
    summaries.push(
      <a href="#beneficiaires">
        {beneficiairesCount} bénéficiaires inscrits à Référentiel des
        Bénéficiaires Effectifs
      </a>
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
    } else if (isServicePublic(uniteLegale)) {
      return <NoDirigeantServicePublic />;
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
