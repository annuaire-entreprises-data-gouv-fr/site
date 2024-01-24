import { INSEE, MI } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IAssociation, IDataAssociation } from '#models/index';
import { getAdresseUniteLegale } from '#models/statut-diffusion';
import Warning from './warning';

const AssociationAdressAlert: React.FC<{
  uniteLegale: IAssociation;
  association: IDataAssociation | IAPINotRespondingError | null;
}> = ({ uniteLegale, association }) => {
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
              <MI /> : {associationAdresse || <NonRenseigne />}
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
