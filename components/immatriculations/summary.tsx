import { isAPINotResponding } from '#models/api-not-responding';
import { estActif } from '#models/etat-administratif';
import { IJustificatifs } from '#models/justificatifs';
import { formatDateLong } from '#utils/helpers';

const ImmatriculationSummary: React.FC<IJustificatifs> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
  immatriculationJOAFE,
  immatriculationRNE,
}) => {
  return (
    <>
      Cette structure est :
      <ul>
        {immatriculationRNE && !isAPINotResponding(immatriculationRNE) && (
          <li>
            {!!immatriculationRNE.identite?.dateRadiation ? (
              <a href="#rncs">
                <b>Radiée</b> du Registre du Commerce et des Sociétés (RCS),
                depuis le{' '}
                {formatDateLong(immatriculationRNE.identite.dateRadiation)}
              </a>
            ) : (
              <a href="#rne">
                <b>Inscrite</b> au Registre National des Entreprises (RNE)
                {!!immatriculationRNE.identite?.dateImmatriculation && (
                  <>
                    , depuis le{' '}
                    {formatDateLong(
                      immatriculationRNE.identite?.dateImmatriculation
                    )}
                  </>
                )}
              </a>
            )}
          </li>
        )}

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
                <b>Radiée</b> du Répertoire des métiers (RNM), depuis le{' '}
                {formatDateLong(immatriculationRNM.dateRadiation)}
              </a>
            ) : (
              <a href="#rnm">
                <b>Inscrite</b> au Répertoire des métiers (RNM), depuis le{' '}
                {formatDateLong(immatriculationRNM.dateImmatriculation)}
              </a>
            )}
          </li>
        )}
        {immatriculationRNCS && !isAPINotResponding(immatriculationRNCS) && (
          <li>
            {immatriculationRNCS.identite.dateRadiation ? (
              <a href="#rncs">
                <b>Radiée</b> du Registre du Commerce et des Sociétés (RCS),
                depuis le{' '}
                {formatDateLong(immatriculationRNCS.identite.dateRadiation)}
              </a>
            ) : (
              <a href="#rncs">
                <b>Inscrite</b> au Registre du Commerce et des Sociétés (RCS){' '}
                {immatriculationRNCS.identite.dateImmatriculation
                  ? `, depuis le ${formatDateLong(
                      immatriculationRNCS.identite.dateImmatriculation
                    )}`
                  : ''}
              </a>
            )}
          </li>
        )}
        <li>
          {estActif(uniteLegale) ? (
            <a href="#insee">
              <b>Inscrite</b> à l’Insee, depuis le{' '}
              {formatDateLong(uniteLegale.dateCreation)}
            </a>
          ) : (
            <a href="#insee">
              <b>Cessée</b> auprès de l’Insee, depuis le{' '}
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
