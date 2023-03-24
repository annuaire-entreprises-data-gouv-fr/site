import { isAPINotResponding } from '#models/api-not-responding';
import { estActif } from '#models/etat-administratif';
import { IJustificatifs } from '#models/justificatifs';
import { formatDateLong } from '#utils/helpers';

const ImmatriculationSummary: React.FC<IJustificatifs> = ({
  uniteLegale,
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
              <a href="#rne">
                <b>Radiée</b> du Registre National des Entreprises (RNE), depuis
                le {formatDateLong(immatriculationRNE.identite.dateRadiation)}
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
