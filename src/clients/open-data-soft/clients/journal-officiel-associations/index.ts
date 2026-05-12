import routes from "#/clients/routes";
import type { IAnnoncesAssociation } from "#/models/annonces";
import constants from "#/models/constants";
import { formatDateLong, type IdRna, type Siren } from "#/utils/helpers";
import { getFiscalYear } from "#/utils/helpers/formatting/format-fiscal-year";
import odsClient from "../..";

interface IJournalOfficielAssociationRecord {
  annonce_type_facette: string; // 'Associations loi du 1er juillet 1901/Création/Initial';
  association_type: string; // 'assoLoi1901';
  association_type_libelle: string; // 'Associations loi du 1er juillet 1901';
  contenu: string; // '{"assoLoi1901": {"lieuDeclaration": {"lieuPref": {"libelle": ""}}, "creation": {"titre": "Cercle Caennais et la LIGUE DE L\'ENSEIGNEMENT", "siegeSocial": {"commune": "", "BP_ou_Lieudit_ou_CommuneDeleguee": "", "pays": "France", "complGeographique": "Caen (Calvados)"}, "siteWeb": "", "objet": "Education populaire"}, "dateDeclaration": "1901-11-19"}}';
  cronosort: string; // '1901-12-20T03:59:59+00:00';
  datedeclaration: string; // '1901-11-19';
  dateparution: string; // '1901-12-20';
  departement_code: string; // '00';
  domaine_activite_categorise: string; // '50000/';
  domaine_activite_libelle_categorise: string; // 'Domaines Divers/';
  etatavis: string; // 'Initial';
  id: string; // '190103450001';
  internal_contenu_main_node: string; // 'assoLoi1901';
  internal_contenu_subnode: string; // 'creation';
  localisation_facette: string; // '/';
  metadonnees_type_code: string; // '1';
  numero_annonce: 1;
  numero_rna: string; // 'ASS00001';
  parution_numero: string; // '19010345';
  source: string; // 'joafe';
  titre: string; // "Cercle Caennais et la LIGUE DE L'ENSEIGNEMENT";
  titre_search: string; // '"Cercle Caennais et la LIGUE DE L'ENSEIGNEMENT";
  typeavis: string; // 'Création';
}

interface IDCAField {
  annonce_type_facette: string;
  association_type: string;
  association_type_libelle: string;
  cronosort: string;
  dateparution: string;
  dca_codepostal: string;
  dca_datecloture: string;
  dca_datevalidation: string;
  dca_rectificatif_version: number;
  dca_siren: string;
  departement_code: string;
  departement_libelle: string;
  id: string;
  localisation_facette: string;
  numero_rna: string;
  region_code: string;
  region_libelle: string;
  siteweb: string;
  source: string;
  titre: string;
  titre_search: string;
}

export const clientJOAFE = async (
  idRna: string
): Promise<IAnnoncesAssociation> => {
  const searchUrl = `${routes.journalOfficielAssociations.ods.search}&q=numero_rna=${idRna}&refine.source=joafe&sort=dateparution`;
  const metaDataUrl = routes.journalOfficielAssociations.ods.metadata;
  const response = await odsClient(
    { url: searchUrl, config: { timeout: constants.timeout.L } },
    metaDataUrl
  );

  return {
    annonces: response.records.map(
      (annonce: IJournalOfficielAssociationRecord) => ({
        typeAvisLibelle: annonce.typeavis || "",
        datePublication: annonce.dateparution || "",
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
 */
export const clientDCA = async (
  siren: Siren,
  idRna: IdRna | string
): Promise<IAnnoncesAssociation> => {
  const filterParam = `&q=dca_siren=${siren}+OR+numero_rna=${idRna}&refine.source=dca&sort=dca_datecloture`;

  const searchUrl = `${routes.journalOfficielAssociations.ods.search}${filterParam}`;
  const metaDataUrl = routes.journalOfficielAssociations.ods.metadata;

  const response = await odsClient({ url: searchUrl }, metaDataUrl);

  return {
    annonces: response.records.map((compte: IDCAField) => ({
      datePublication: compte.dateparution,
      numeroParution: compte.id,
      typeAvisLibelle: `Dépôt de compte ${getFiscalYear(
        compte.dca_datecloture
      )}`,
      details: `Date de clôture de l'exercice : ${formatDateLong(
        compte.dca_datecloture
      )}`,
      path: `${routes.journalOfficielAssociations.site.dca}/?q.id=id:${compte.id}`,
    })),
    lastModified: response.lastModified,
  };
};
