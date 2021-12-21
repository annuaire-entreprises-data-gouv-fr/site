import { IUniteLegale } from '../../models';
import { escapeTerm } from '../../utils/helpers/formatting';
import { INSEE, MI } from '../administrations';
import Warning from './warning';

const checkAdressConsistency = (
  uniteLegale: IUniteLegale,
  associationAdresse: string
) => {
  try {
    return (
      associationAdresse &&
      escapeTerm(uniteLegale.siege.adresse.toLowerCase()) !==
        escapeTerm(associationAdresse.toLowerCase())
    );
  } catch {
    return false;
  }
};

const AssociationAdressAlert: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  const associationAdresse =
    (uniteLegale.association &&
      uniteLegale.association.id &&
      uniteLegale.association.adresse) ||
    '';

  const areAdressesInconsistent = checkAdressConsistency(
    uniteLegale,
    associationAdresse
  );

  return (
    <>
      {areAdressesInconsistent && (
        <Warning full>
          Cette association possède deux adresses différentes.
          <br />
          L’une est déclarée au <MI /> (en préfecture) :{' '}
          <b>{associationAdresse || 'Non renseignée'}</b>, l’autre est déclarée
          à l’
          <INSEE /> : <b>{uniteLegale.siege.adresse || 'Non renseignée'}</b>.
          <br />
          Si vous êtes membre de cette association. Contactez l’administration
          concernée pour corriger l’erreur.
        </Warning>
      )}
    </>
  );
};
export default AssociationAdressAlert;
