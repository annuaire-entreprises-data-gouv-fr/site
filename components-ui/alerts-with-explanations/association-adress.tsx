import { INSEE, MI } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IDataAssociation } from '#models/association/types';
import {
  getAdresseUniteLegale,
  getPersonnalDataAssociation,
} from '#models/core/statut-diffusion';
import { IAssociation } from '#models/core/types';
import { ISession } from '#models/user/session';
import { Warning } from '../alerts';

const AssociationAdressAlert: React.FC<{
  uniteLegale: IAssociation;
  association: IDataAssociation | IAPINotRespondingError | null;
  session: ISession | null;
}> = ({ uniteLegale, association, session }) => {
  if (!association || isAPINotResponding(association)) {
    return null;
  }

  const adresseInconsistency = association.adresseInconsistency;

  const associationAdresse = association.adresseSiege;

  return (
    <>
      {adresseInconsistency && (
        <Warning full>
          L’adresse déclarée auprès du <MI /> (en préfecture){' '}
          <strong>est différente</strong> de celle déclarée auprès de l’
          <INSEE /> :
          <ul>
            <li>
              <MI /> :{' '}
              {getPersonnalDataAssociation(
                associationAdresse,
                uniteLegale,
                session
              ) || <NonRenseigne />}
            </li>
            <li>
              <INSEE /> : {getAdresseUniteLegale(uniteLegale, null)}
            </li>
          </ul>
          Si vous êtes membre de cette association. Contactez l’administration
          concernée pour corriger l’erreur.
          <br />
          <br />
          <strong>NB :</strong> si vous avez déjà effectué la correction auprès
          du <MI />, sachez qu’elle peut prendre quelques semaines avant d’être
          prise en compte dans les bases de données.
        </Warning>
      )}
    </>
  );
};
export default AssociationAdressAlert;
