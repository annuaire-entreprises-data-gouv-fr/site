import { IAssociation } from '../../models';
import { formatAdresse } from '../../utils/labels';
import { httpGet } from '../../utils/network/http';
import { HttpNotFound } from '../exceptions';
import routes from '../routes';

interface IAssociationResponse {
  association: {
    is_waldec: 'true' | 'false';
    id_association: string;
    id_ex_association: string;
    siret: string;
    numero_reconnaissance_utilite_publique: string;
    code_gestion: string;
    date_creation: string;
    date_derniere_declaration: string;
    date_publication_creation: string;
    date_declaration_dissolution: string;
    nature: string;
    groupement: string;
    titre: string;
    titre_court: string;
    objet: string;
    objet_social1: string;
    objet_social2: string;
    adresse_numero_voie: string;
    adresse_repetition: string;
    adresse_type_voie: string;
    adresse_libelle_voie: string;
    adresse_code_postal: string;
    adresse_libelle_commune: string;
    dirigeant_civilite: string;
    telephone: string;
    site_web: string;
    email: string;
    autorisation_publication_web: string;
    observation: string;
    position_activite: string;
    derniere_maj: string;
    created_at: string;
    updated_at: string;
  };
}
/**
 * GET Association
 */

const getAssociation = async (numeroRna: string): Promise<IAssociation> => {
  const route = `${routes.rna.id}${numeroRna}`;
  const response = await httpGet(route);

  return mapToDomainObject(response as IAssociationResponse);
};

export const mapToDomainObject = (
  association: IAssociationResponse
): IAssociation => {
  const {
    association: {
      titre,
      objet,
      id_association,
      id_ex_association,
      adresse_numero_voie,
      adresse_repetition,
      adresse_type_voie,
      adresse_libelle_voie,
      adresse_code_postal,
      adresse_libelle_commune,
    },
  } = association;
  return {
    id: id_association,
    exId: id_ex_association,
    nomComplet: titre,
    objet,
    adresse: formatAdresse(
      adresse_numero_voie,
      adresse_repetition,
      adresse_type_voie,
      adresse_libelle_voie,
      adresse_code_postal,
      adresse_libelle_commune
    ),
  };
};

export { getAssociation };
