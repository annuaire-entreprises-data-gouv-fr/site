import { INPI, INSEE, MI } from '#components/administrations';
import { isAPINotResponding } from '#models/api-not-responding';
import { IDirigeants } from '#models/dirigeants';
import { isServicePublic } from '#models/index';

const DirigeantSummary: React.FC<IDirigeants> = ({
  uniteLegale,
  immatriculationRNCS,
}) => {
  const notFound =
    isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.errorType === 404;

  const hasNoDirigeant =
    (!uniteLegale.dirigeant && notFound) ||
    //@ts-ignore
    (!uniteLegale.dirigeant && !(immatriculationRNCS?.dirigeants.length > 0));

  const insee = uniteLegale.dirigeant && '1 dirigeant(e) inscrit(e) à l’Insee';
  const rncs =
    !isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.dirigeants &&
    `${immatriculationRNCS.dirigeants.length} dirigeants inscrits au Registre du Commerce et des Sociétés (RCS)`;

  const rbe =
    !isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.beneficiaires &&
    `${immatriculationRNCS.beneficiaires.length} bénéficiaires inscrits à Référentiel des Bénéficiaires Effectifs`;

  if (hasNoDirigeant) {
    if (uniteLegale.association.idAssociation) {
      return (
        <>
          <p>
            Cette association n’a pas de dirigeant(e) enregistré(e) auprès de l’
            <INSEE /> ou auprès de l’
            <INPI />
          </p>
          <p>
            Si des dirigeants ont été déclarés auprès du <MI /> vous les
            retrouverez sur l&apos;onglet “personnes physiques“ de :{' '}
            <a
              target="_blank"
              href={`https://www.data-asso.fr/annuaire/association/${uniteLegale.association.idAssociation}?docFields=documentsDac,documentsRna`}
              rel="noreferrer"
            >
              data-asso
            </a>{' '}
          </p>
        </>
      );
    } else if (isServicePublic(uniteLegale)) {
      return (
        <p>
          Les administrations centrales, ministères et autres services public,
          n&apos;ont pas de dirigeant(e) enregistré(e) dans les bases de données
          de l’
          <INSEE /> ou de <INPI />.
        </p>
      );
    }
    return (
      <p>
        Cette structure n’a pas de dirigeant(e) enregistré(e), que ce soit
        auprès de l’
        <INSEE /> ou auprès de l’
        <INPI />.
      </p>
    );
  }

  return insee || rncs || rbe ? (
    <>
      Cette structure possède :
      <ul>
        {insee && (
          <li>
            <a href="#insee-dirigeant">{insee}</a>
          </li>
        )}
        {rncs && (
          <li>
            <a href="#rncs-dirigeants">{rncs}</a>
          </li>
        )}
        {rbe && (
          <li>
            <a href="#beneficiaires">{rbe}</a>
          </li>
        )}
      </ul>
      <br />
    </>
  ) : null;
};

export default DirigeantSummary;
