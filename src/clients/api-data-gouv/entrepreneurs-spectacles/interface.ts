interface IEntrepreneursSpectaclesDatagouvItem {
  __id: string;
  categorie: number;
  code_naf_ape: string;
  code_postal_lieu: string;
  code_postal_siret: string;
  date_depot_dossier: string;
  date_expire_licence: string | null;
  date_retrait_licence: string | null;
  date_validite: string;
  departement_siret: string;
  geoloc_cp_siret: string;
  nom_lieu: string;
  numero_recepisse: string;
  raison_sociale: string;
  region_siret: string;
  siren_siret: string;
  statut_recepisse: string;
  type_declarant: string;
  type_declaration: string;
}

export interface IEntrepreneursSpectaclesDatagouvResponse {
  data: IEntrepreneursSpectaclesDatagouvItem[];
  links: {
    profile: string;
    swagger: string;
    next: string | null;
    prev: string | null;
  };
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}

interface IEntrepreneursSpectaclesLicence {
  categorie: string;
  dateDepot: string;
  dateFinValidite: string | null;
  dateValidite: string;
  nomLieu: string;
  numeroRecepisse: string;
  statut: string;
  type: string;
}

export interface IEntrepreneursSpectacles {
  licences: IEntrepreneursSpectaclesLicence[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}
