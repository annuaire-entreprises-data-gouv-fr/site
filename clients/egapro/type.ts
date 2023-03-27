export type EgaproResponse = {
  data?: DataEntity[] | null;
  count: number;
};

export type DataEntity = {
  entreprise: Entreprise;
  notes: Notes;
  notes_remunerations: Notes;
  notes_augmentations: Notes;
  notes_promotions: Notes;
  notes_augmentations_et_promotions: Notes;
  notes_conges_maternite: Notes;
  notes_hautes_rémunérations: Notes;
  label: string;
};

export type Entreprise = {
  raison_sociale: string;
  siren: string;
  région?: string | null;
  département?: string | null;
  code_naf: string;
  ues?: Ues | null;
  effectif: Effectif;
};

export type Ues = {
  nom: string;
  entreprises?: EntreprisesEntity[] | null;
};

export type EntreprisesEntity = {
  raison_sociale: string;
  siren: string;
};

export type TrancheType = '50:250' | '251:999' | '1000:';

export type Effectif = {
  tranche: TrancheType;
};

export type Notes = {
  2018?: number | null;
  2019?: number | null;
  2020?: number | null;
  2021?: number | null;
  2022?: number | null;
};

export type AllNote = Omit<DataEntity, 'entreprise' | 'label'>;

export type FormattedScores = {
  [key: string]: {
    notes?: number;
    notes_augmentations?: number;
    notes_augmentations_et_promotions?: number;
    notes_conges_maternite?: number;
    notes_hautes_rémunérations?: number;
    notes_promotions?: number;
    notes_remunerations?: number;
  };
};

export type Score = {
  annee?: string;
  notes?: number;
  notes_augmentations?: number;
  notes_augmentations_et_promotions?: number;
  notes_conges_maternite?: number;
  notes_hautes_rémunérations?: number;
  notes_promotions?: number;
  notes_remunerations?: number;
};
