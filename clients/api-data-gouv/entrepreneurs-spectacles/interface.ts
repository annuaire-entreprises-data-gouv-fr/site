type IEntrepreneursSpectaclesDatagouvItem = {
  __id: string;
  numero_recepisse: string;
  date_validite: string;
  date_depot_dossier: string;
  statut_recepisse: string;
  categorie: number;
  type_declaration: string;
  type_declarant: string;
  raison_sociale: string;
  code_postal_siret: string;
  siren_siret: string;
  nom_lieu: string;
  code_postal_lieu: string;
  code_naf_ape: string;
  geoloc_cp_siret: string;
  region_siret: string;
  departement_siret: string;
  date_expire_licence: string | null;
  date_retrait_licence: string | null;
};

export type IEntrepreneursSpectaclesDatagouvResponse = {
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
};

type IEntrepreneursSpectaclesLicence = {
  categorie: string;
  numeroRecepisse: string;
  statut: string;
  dateValidite: string;
  dateDepot: string;
  type: string;
  nomLieu: string;
};

export type IEntrepreneursSpectacles = {
  licences: IEntrepreneursSpectaclesLicence[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
};
