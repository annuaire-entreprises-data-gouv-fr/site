export type IFiness = {
  idFinessJuridique: string;
  raisonSociale: string;
  siren: string;
  finessEtablissements: IFinessEtablissement[];
};

export type IFinessList = {
  data: IFiness[];
  meta: {
    page: number;
    page_size: number;
    total: number;
  };
  etablissementsMeta: {
    page: number;
    page_size: number;
    total: number;
  };
};

export type IFinessEtablissement = {
  idFinessGeo: string;
  siret: string;
  raisonSociale: string;
  phone: string;
  category: string;
  MFT: string;
  SPH: string;
  adresse: string;
};
