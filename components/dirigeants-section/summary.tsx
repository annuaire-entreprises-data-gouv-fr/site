import { isAPINotResponding } from '../../models/api-not-responding';
import { IDirigeants } from '../../models/dirigeants';
import { INPI, INSEE } from '../administrations';

const DirigeantSummary: React.FC<IDirigeants> = ({
  uniteLegale,
  immatriculationRNCS,
}) => {
  const notFound =
    isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.errorType === 404;

  const hasNoDirigeant = !uniteLegale.dirigeant && notFound;

  const insee = uniteLegale.dirigeant && '1 dirigeant(e) inscrit(e) à l’Insee';
  const rncs =
    !isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.dirigeants &&
    `${immatriculationRNCS.dirigeants.length} dirigeants inscrits au Registre du Commerce et des Sociétés (RCS)`;

  const rbe =
    !isAPINotResponding(immatriculationRNCS) &&
    immatriculationRNCS.beneficiaires &&
    `${immatriculationRNCS.beneficiaires.length} bénéficiaires inscrits à Référentiel des Bénéficiaires Effectifs`;

  return (
    <>
      {hasNoDirigeant ? (
        <p>
          Cette entité n’a pas de dirigeant(e) enregistré(e), que ce soit auprès
          de l’
          <INSEE /> ou auprès de l’
          <INPI />.
        </p>
      ) : (
        (insee || rncs || rbe) && (
          <>
            Cette entité possède :
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
        )
      )}
    </>
  );
};

export default DirigeantSummary;
