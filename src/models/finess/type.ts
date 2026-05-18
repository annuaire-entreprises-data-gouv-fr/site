export interface IFiness {
  finessEtablissements: IFinessEtablissement[];
  idFinessJuridique: string;
  raisonSociale: string;
  siren: string;
}

export interface IFinessList {
  data: IFiness[];
  etablissementsMeta: {
    page: number;
    page_size: number;
    total: number;
  };
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
}

export interface IFinessEtablissement {
  adresse: string;
  category: string;
  idFinessGeo: string;
  MFT: string;
  phone: string;
  raisonSociale: string;
  SPH: string;
  siret: string;
}
