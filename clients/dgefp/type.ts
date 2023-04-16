export type IOrganismesFormationResponse = {
  nhits: number | null;
  parameters: Parameters;
  records: Record[];
};

export type Parameters = {
  dataset: Dataset;
  rows: number | null;
  start: number | null;
  format: string;
  timezone: string;
};

export enum Dataset {
  ListePubliqueDESOfV2 = 'liste-publique-des-of-v2',
}

export type Record = {
  datasetid: Dataset;
  recordid: string;
  fields: Fields;
  record_timestamp: Date;
};

export type Fields = {
  informationsdeclarees_datedernieredeclaration: string;
  random_id: number | null;
  informationsdeclarees_debutexercice: string;
  certifications: string;
  certifications_bilansdecompetences: string;
  reg_name: string;
  dep_name: string;
  certifications_actionsdeformationparapprentissage: string;
  certifications_vae: string;
  toutes_specialites: string;
  siren: string;
  denomination: string;
  siretetablissementdeclarant: string;
  certifications_actionsdeformation: string;
  adressephysiqueorganismeformation_coderegion: string;
  numerosdeclarationactiviteprecedent: string;
  numerodeclarationactivite: string;
  reg_code: number | null;
  informationsdeclarees_specialitesdeformation_libellespecialite1: string;
  informationsdeclarees_specialitesdeformation_codespecialite1: string;
  informationsdeclarees_finexercice: string;
  informationsdeclarees_specialitesdeformation_libellespecialite2: string;
  informationsdeclarees_specialitesdeformation_codespecialite2: string;
  informationsdeclarees_effectifformateurs: number | null;
  informationsdeclarees_nbstagiairesconfiesparunautreof: number | null;
  informationsdeclarees_nbstagiaires: number | null;
  informationsdeclarees_specialitesdeformation_libellespecialite3: string;
  informationsdeclarees_specialitesdeformation_codespecialite3: string;
  geocodageban: number[];
  dep_code: string;
  adressephysiqueorganismeformation_voie: string;
  adressephysiqueorganismeformation_ville: string;
  adressephysiqueorganismeformation_codepostal: string;
  epci_name: string;
  epci_code: string;
  com_arm_name: string;
  com_arm_code: string;
  organismeetrangerrepresente_denomination: string;
  organismeetrangerrepresente_pays: string;
  organismeetrangerrepresente_voie: string;
  organismeetrangerrepresente_ville: string;
  organismeetrangerrepresente_codepostal: string;
};

export enum Type {
  Point = 'Point',
}
