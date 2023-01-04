export interface IEducationNationaleRecords {
  nhits: number;
  parameters: IEducationNationaleParameters;
  records: IEducationNationaleRecord[];
}

export interface IEducationNationaleParameters {
  dataset: string;
  rows: number;
  start: number;
  format: string;
  timezone: string;
}

export interface IEducationNationaleRecord {
  datasetid: string;
  recordid: string;
  fields: IEducationNationaleFields;
  geometry: IEducationNationaleGeometry;
  record_timestamp: string;
}

export interface IEducationNationaleFields {
  adresse_1?: string | null;
  adresse_2?: string | null;
  adresse_3?: string | null;
  appartenance_education_prioritaire?: string | null;
  apprentissage?: string | null;
  code_academie?: string | null;
  code_commune?: string | null;
  code_departement?: string | null;
  code_nature?: number | null;
  code_postal?: string | null;
  code_region?: string | null;
  code_type_contrat_prive?: string | null;
  code_zone_animation_pedagogique?: string | null;
  coordx_origine?: number | null;
  coordy_origine?: number | null;
  date_maj_ligne?: string | null;
  date_ouverture?: string | null;
  ecole_elementaire?: number | null;
  ecole_maternelle?: number | null;
  epsg_origine?: string | null;
  etablissement_mere?: string | null;
  etat?: string | null;
  fax?: string | null;
  fiche_onisep?: string | null;
  greta?: string | null;
  hebergement?: number | null;
  identifiant_de_l_etablissement?: string | null;
  latitude?: number | null;
  libelle_academie?: string | null;
  libelle_departement?: string | null;
  libelle_nature?: string | null;
  libelle_region?: string | null;
  libelle_zone_animation_pedagogique?: string | null;
  longitude?: number | null;
  lycee_agricole?: string | null;
  lycee_des_metiers?: string | null;
  lycee_militaire?: string | null;
  mail?: string | null;
  ministere_tutelle?: string | null;
  multi_uai?: number | null;
  nom_circonscription?: string | null;
  nom_commune?: string | null;
  nom_etablissement?: string | null;
  nombre_d_eleves?: number | null;
  pial?: string | null;
  position?: number[] | null;
  post_bac?: string | null;
  precision_localisation?: string | null;
  restauration?: number | null;
  rpi_concentre?: number | null;
  rpi_disperse?: string | null;
  section_arts?: string | null;
  section_cinema?: string | null;
  section_europeenne?: string | null;
  section_internationale?: string | null;
  section_sport?: string | null;
  section_theatre?: string | null;
  segpa?: string | null;
  siren_siret?: string | null;
  statut_public_prive?: string | null;
  telephone?: string | null;
  type_contrat_prive?: string | null;
  type_etablissement?: string | null;
  type_rattachement_etablissement_mere?: string | null;
  ulis?: number | null;
  voie_generale?: string | null;
  voie_professionnelle?: string | null;
  voie_technologique?: string | null;
  web?: string | null;
}

export interface IEducationNationaleGeometry {
  type?: string | null;
  coordinates?: number[] | null;
}
