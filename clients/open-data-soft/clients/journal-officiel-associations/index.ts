import routes from '#clients/routes';
import { IAnnoncesAssociation, IComptesAssociation } from '#models/annonces';
import { IdRna, Siren } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import odsClient from '../../back-ods-client';

type IJournalOfficielAssociationRecord = {
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
};

type IDCACompte = {
  datasetid: string;
  recordid: string;
  fields: IDCAField[];
  record_timestamp: string;
};

type IDCAField = {
  departement_code: string;
  dca_siren: string;
  localisation_facette: string;
  titre: string;
  region_libelle: string;
  cronosort: string;
  dateparution: string;
  departement_libelle: string;
  association_type: string;
  titre_search: string;
  siteweb: string;
  numero_rna: string;
  annonce_type_facette: string;
  dca_datecloture: string;
  dca_codepostal: string;
  source: string;
  dca_rectificatif_version: number;
  id: string;
  region_code: string;
  association_type_libelle: string;
  dca_datevalidation: string;
};

const clientJOAFE = async (idRna: string): Promise<IAnnoncesAssociation> => {
  const searchUrl = `${routes.journalOfficielAssociations.ods.search}&q=numero_rna=${idRna}&refine.source=joafe&sort=dateparution`;
  const metaDataUrl = routes.journalOfficielAssociations.ods.metadata;
  const response = await odsClient({ url: searchUrl }, metaDataUrl);

  return {
    annonces: response.records.map(
      (annonce: IJournalOfficielAssociationRecord) => ({
        typeAvisLibelle: annonce.typeavis || '',
        datePublication: annonce.dateparution || '',
        numeroParution: annonce.id,
        details: annonce.association_type_libelle,
        path: `${routes.journalOfficielAssociations.site.justificatif}${annonce.id}`,
      })
    ),
    lastModified: response.lastModified,
  };
};

/**
 * DCA Dépôt des Compotes des Associations
 **/
const clientDCA = async (
  siren: Siren,
  idRna: IdRna | string
): Promise<IComptesAssociation> => {
  const filterParam = `&q=dca_siren=${siren}+OR+numero_rna=${idRna}&refine.source=dca&sort=dca_datecloture`;

  const searchUrl = `${routes.journalOfficielAssociations.ods.search}${filterParam}`;
  const metaDataUrl = routes.journalOfficielAssociations.ods.metadata;

  const response = await odsClient({ url: searchUrl }, metaDataUrl);

  return {
    comptes: response.records.map((compte: IDCAField) => ({
      dateparution: compte.dateparution,
      numeroParution: compte.id,
      datecloture: compte.dca_datecloture || '',
      anneeCloture: getFiscalYear(compte.dca_datecloture) || '',
      permalinkUrl: `${routes.journalOfficielAssociations.site.dca}/?q.id=id:${compte.id}`,
    })),
    lastModified: response.lastModified,
  };
};

export { clientDCA, clientJOAFE };
