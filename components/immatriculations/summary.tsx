import { isAPINotResponding } from '../../models/api-not-responding';
import { IJustificatifs } from '../../models/justificatifs';
import { formatDateLong } from '../../utils/helpers/formatting';

const ImmatriculationSummary: React.FC<IJustificatifs> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
}) => {
  return (
    <>
      Cette entité est :
      <ul>
        {immatriculationJOAFE && !isAPINotResponding(immatriculationJOAFE) && (
          <li>
            <a href="#joafe">
              <b>Enregistrée</b> au Journal Officiel des Associations (JOAFE),
              depuis le {formatDateLong(immatriculationJOAFE.datePublication)}
            </a>
          </li>
        )}
        {immatriculationRNM && !isAPINotResponding(immatriculationRNM) && (
          <li>
            {immatriculationRNM.dateRadiation ? (
              <a href="#rnm">
                <b>Radiée</b> du Répertoire des métiers (RNM), depuis le
                {formatDateLong(immatriculationRNM.dateRadiation)}
              </a>
            ) : (
              <a href="#rnm">
                <b>Inscrite</b> au Répertoire des métiers (RNM), depuis le
                {formatDateLong(immatriculationRNM.dateImmatriculation)}
              </a>
            )}
          </li>
        )}
        {immatriculationRNCS && !isAPINotResponding(immatriculationRNCS) && (
          <li>
            {immatriculationRNCS.dateRadiation ? (
              <a href="#rncs">
                <b>Radiée</b> du Registre du Commerce et des Sociétés (RCS),
                depuis le
                {formatDateLong(immatriculationRNCS.dateRadiation)}
              </a>
            ) : (
              <a href="#rncs">
                <b>Inscrite</b> au Registre du Commerce et des Sociétés (RCS),
                depuis le{' '}
                {formatDateLong(immatriculationRNCS.dateImmatriculation)}
              </a>
            )}
          </li>
        )}
        <li>
          {uniteLegale.estActive ? (
            <a href="#insee">
              <b>Inscrite</b> à l’Insee, depuis le
              {formatDateLong(uniteLegale.dateCreation)}
            </a>
          ) : (
            <a href="#insee">
              <b>Cessée</b> auprès de l’Insee, depuis le
              {formatDateLong(uniteLegale.dateDebutActivite)}
            </a>
          )}
        </li>
      </ul>
      <br />
    </>
  );
};

export default ImmatriculationSummary;
