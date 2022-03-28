import { isAPINotResponding } from '../../models/api-not-responding';
import { IDirigeants } from '../../models/dirigeants';
import { INPI, INSEE } from '../administrations';

const DirigeantSummary: React.FC<IDirigeants> = ({
  uniteLegale,
  dirigeants,
  beneficiaires,
}) => {
  const notFoundInRCS =
    isAPINotResponding(dirigeants) && dirigeants.errorType === 404;
  const notFoundInRBE =
    isAPINotResponding(beneficiaires) && beneficiaires.errorType === 404;

  const hasNoDirigeant =
    !uniteLegale.dirigeant && notFoundInRCS && notFoundInRBE;

  const insee = uniteLegale.dirigeant && '1 dirigeant(e) inscrite à l’Insee';
  const rncs =
    dirigeants &&
    !isAPINotResponding(dirigeants) &&
    `${dirigeants.length} dirigeant(s) inscrit(s) au Registre du Commerce et des Sociétés (RCS)`;

  const rbe =
    (beneficiaires &&
      !isAPINotResponding(beneficiaires) &&
      `${beneficiaires.length} bénéficiaire(s) inscrit(s) au Référentiel des Bénéficiaires Effectifs`) ||
    '0 bénéficiaire(s) inscrit(s) au Référentiel des Bénéficiaires Effectifs.';

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
