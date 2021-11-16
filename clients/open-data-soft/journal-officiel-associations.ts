import odsClient from '.';
import { IAnnoncesJO } from '../../models/annonces';
import { formatDate } from '../../utils/helpers/formatting';
import routes from '../routes';

interface IJournalOfficielAssociationRecord {
  association_type: string; // 'assoLoi1901';
  annonce_type_facette: string; // 'Associations loi du 1er juillet 1901/Création/Initial';
  internal_contenu_subnode: string; // 'creation';
  id: string; // '190103450001';
  domaine_activite_categorise: string; // '50000/';
  contenu: string; // '{"assoLoi1901": {"lieuDeclaration": {"lieuPref": {"libelle": ""}}, "creation": {"titre": "Cercle Caennais et la LIGUE DE L\'ENSEIGNEMENT", "siegeSocial": {"commune": "", "BP_ou_Lieudit_ou_CommuneDeleguee": "", "pays": "France", "complGeographique": "Caen (Calvados)"}, "siteWeb": "", "objet": "Education populaire"}, "dateDeclaration": "1901-11-19"}}';
  parution_numero: string; // '19010345';
  datedeclaration: string; // '1901-11-19';
  localisation_facette: string; // '/';
  etatavis: string; // 'Initial';
  titre: string; // "Cercle Caennais et la LIGUE DE L'ENSEIGNEMENT";
  numero_rna: string; // 'ASS00001';
  internal_contenu_main_node: string; // 'assoLoi1901';
  numero_annonce: 1;
  typeavis: string; // 'Création';
  dateparution: string; // '1901-12-20';
  cronosort: string; // '1901-12-20T03:59:59+00:00';
  titre_search: string; // '"Cercle Caennais et la LIGUE DE L'ENSEIGNEMENT";
  domaine_activite_libelle_categorise: string; // 'Domaines Divers/';
  departement_code: string; // '00';
  metadonnees_type_code: string; // '1';
  source: string; // 'joafe';
  association_type_libelle: string; // 'Associations loi du 1er juillet 1901';
}

const fetchAnnoncesJO = async (idRna: string): Promise<IAnnoncesJO> => {
  const searchUrl = `${routes.journalOfficielAssociations.ods.search}&q=numero_rna%3A${idRna}+source%3Ajoafe&sort=dateparution`;
  const metadataUrl = routes.journalOfficielAssociations.ods.metadata;
  const response = await odsClient(searchUrl, metadataUrl);

  return {
    annonces: response.records.map(mapToDomainObject),
    lastModified: response.lastModified,
  };
};

const mapToDomainObject = (annonce: IJournalOfficielAssociationRecord) => {
  return {
    typeAvisLibelle: annonce.typeavis || '',
    datePublication: annonce.dateparution || '',
    numeroParution: annonce.id,
    details: annonce.association_type_libelle,
    path: `${routes.journalOfficielAssociations.site.justificatif}${annonce.id}`,
  };
};

export default fetchAnnoncesJO;
