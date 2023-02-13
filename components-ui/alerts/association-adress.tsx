import { INSEE, MI } from '#components/administrations';
import { IAssociation } from '#models/index';
import Warning from './warning';

const AssociationAdressAlert: React.FC<{ uniteLegale: IAssociation }> = ({
  uniteLegale,
}) => {
  const adresseInconsistency =
    uniteLegale.association && uniteLegale.association.adresseInconsistency;

  const associationAdresse =
    uniteLegale.association && uniteLegale.association.adresseSiege;

  return (
    <>
      {adresseInconsistency && (
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
