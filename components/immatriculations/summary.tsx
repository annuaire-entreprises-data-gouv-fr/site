import { isAPINotResponding } from '../../models/api-not-responding';
import { IJustificatifs } from '../../models/justificatifs';
import { formatDateLong } from '../../utils/helpers/formatting';
import Warning from '../alerts/warning';

const ImmatriculationSummary: React.FC<IJustificatifs> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
}) => {
  let joafe = '';
  if (immatriculationJOAFE && !isAPINotResponding(immatriculationJOAFE)) {
    joafe = `Enregistrée au Journal Officiel des Associations (JOAFE), depuis le ${formatDateLong(
      immatriculationJOAFE.datePublication
    )}`;
  }

  let rnm = '';
  if (immatriculationRNM && !isAPINotResponding(immatriculationRNM)) {
    if (immatriculationRNM.dateRadiation) {
      rnm = `Radiée du Répertoire des métiers (RNM), depuis le ${formatDateLong(
        immatriculationRNM.dateRadiation
      )}`;
    } else {
      rnm = `Inscrite au Répertoire des métiers (RNM), depuis le ${formatDateLong(
        immatriculationRNM.dateImmatriculation
      )}`;
    }
  }

  let rncs = '';
  if (immatriculationRNCS && !isAPINotResponding(immatriculationRNCS)) {
    if (immatriculationRNCS.dateRadiation) {
      rncs = `Radiée du Registre du Commerce et des Sociétés (RCS), depuis le ${formatDateLong(
        immatriculationRNCS.dateRadiation
      )}`;
    } else {
      rncs = `Inscrite au Registre du Commerce et des Sociétés (RCS), depuis le ${formatDateLong(
        immatriculationRNCS.dateImmatriculation
      )}`;
    }
  }

  const insee = `Inscrite à l’Insee, depuis le ${formatDateLong(
    uniteLegale.dateCreation
  )}${
    !uniteLegale.estActive
      ? `, cessée depuis le ${formatDateLong(uniteLegale.dateDebutActivite)}`
      : ''
  }`;

  return (
    <>
      Cette entité est :
      <ul>
        {joafe && (
          <li>
            <a href="#joafe">{joafe}</a>
          </li>
        )}
        {rnm && (
          <li>
            <a href="#rnm">{rnm}</a>
          </li>
        )}
        {rncs && (
          <li>
            <a href="#rncs">{rncs}</a>
          </li>
        )}
        <li>
          <a href="#insee">{insee}</a>
        </li>
      </ul>
      <br />
    </>
  );
};

export default ImmatriculationSummary;
