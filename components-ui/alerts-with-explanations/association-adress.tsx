import { INSEE, MI } from "#components/administrations";
import NonRenseigne from "#components/non-renseigne";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#models/api-not-responding";
import type { IDataAssociation } from "#models/association/types";
import type { ISession } from "#models/authentication/user/session";
import { getPersonnalDataAssociation } from "#models/core/diffusion";
import type { IAssociation } from "#models/core/types";
import { Warning } from "../alerts";

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
          Le <MI /> (préfecture) et l’
          <INSEE /> possèdent des adresses différentes pour cette association :
          <ul>
            <li>
              <MI /> :{" "}
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
          Si vous êtes membre de cette association, vous pouvez contacter
          l’administration concernée pour lui demander de corriger l’erreur.
          <br />
          <br />
          <strong>NB :</strong> si vous avez déjà effectué la correction auprès
          de l’administration, sachez que dans certains cas exceptionnels,{" "}
          <strong>
            la mise à jour des données peut prendre jusqu’à deux mois
          </strong>{" "}
          avant d’être totalement prise en compte .
        </Warning>
      )}
    </>
  );
};
export default AssociationAdressAlert;
