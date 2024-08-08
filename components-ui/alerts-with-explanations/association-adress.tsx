import { INSEE, MI } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IDataAssociation } from '#models/association/types';
import { getPersonnalDataAssociation } from '#models/core/diffusion';
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
              <INSEE /> : {uniteLegale.siege.adresse}
            </li>
          </ul>
          Si vous êtes membre de cette association. Contactez l’administration
          concernée pour corriger l’erreur.
          <br />
          <br />
          <strong>NB :</strong> si vous avez déjà effectué la correction auprès
          de l’administration, sachez que dans certains cas exceptionnels,{' '}
          <strong>
            la mise à jour des données peut prendre jusqu’à deux mois
          </strong>{' '}
          avant d’être totalement prise en compte .
        </Warning>
      )}
    </>
  );
};
export default AssociationAdressAlert;
