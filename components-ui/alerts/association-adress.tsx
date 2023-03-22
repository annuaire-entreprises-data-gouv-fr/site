import { INSEE, MI } from '#components/administrations';
import { IAssociation } from '#models/index';
import { getAdresseUniteLegale } from '#models/statut-diffusion';
import Warning from './warning';

const AssociationAdressAlert: React.FC<{ uniteLegale: IAssociation }> = ({
  uniteLegale,
}) => {
  const adresseInconsistency =
    uniteLegale.association?.data?.adresseInconsistency;

  const associationAdresse = uniteLegale.association?.data?.adresseSiege;

  return (
    <>
      {adresseInconsistency && (
        <Warning full>
          Cette association possède deux adresses différentes.
          <br />
          L’une est déclarée au <MI /> (en préfecture) :{' '}
          <b>{associationAdresse || 'Non renseignée'}</b>, l’autre est déclarée
          à l’
          <INSEE /> : <b>{getAdresseUniteLegale(uniteLegale)}</b>.
          <br />
          Si vous êtes membre de cette association. Contactez l’administration
          concernée pour corriger l’erreur.
        </Warning>
      )}
    </>
  );
};
export default AssociationAdressAlert;
