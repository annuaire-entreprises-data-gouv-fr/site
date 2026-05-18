import { INSEE, MI } from "#/components/administrations";
import NonRenseigne from "#/components/non-renseigne";
import { useAuth } from "#/contexts/auth.context";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#/models/api-not-responding";
import type { IDataAssociation } from "#/models/association/types";
import { getPersonnalDataAssociation } from "#/models/core/diffusion";
import type { IAssociation } from "#/models/core/types";
import { Warning } from "../alerts";

const AssociationAdressAlert: React.FC<{
  uniteLegale: IAssociation;
  association: IDataAssociation | IAPINotRespondingError | null;
}> = ({ uniteLegale, association }) => {
  const { user } = useAuth();
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
                user
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
