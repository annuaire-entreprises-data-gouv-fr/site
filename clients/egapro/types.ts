export type IEgaproResponse = {
  data?: IDataEntity[] | null;
  count: number;
};

export type IDataEntity = {
  entreprise: IEntreprise;
  notes: INotes;
  notes_remunerations: INotes;
  notes_augmentations: INotes;
  notes_promotions: INotes;
  notes_augmentations_et_promotions: INotes;
  notes_conges_maternite: INotes;
  notes_hautes_rémunérations: INotes;
  label: string;
};

export type IEntreprise = {
  raison_sociale: string;
  siren: string;
  région?: string | null;
  département?: string | null;
  code_naf: string;
  ues?: IUes | null;
  effectif: IEffectif;
};

export type IUes = {
  nom: string;
  entreprises?: IEntreprisesEntity[] | null;
};

export type IEntreprisesEntity = {
  raison_sociale: string;
  siren: string;
};

export type IEffectif = {
  tranche: ITrancheType;
};

export type ITrancheType = '50:250' | '251:999' | '1000:';

export type INotes = Record<string, number | null>;

export type IEgaproNote = Omit<IDataEntity, 'entreprise' | 'label'>;

export type IFormattedScores = {
  [key: string]: IEgaproScore;
};

export type IEgaproScore = {
  annee: string | null;
  notes: number | null;
  notes_augmentations: number | null;
  notes_augmentations_et_promotions: number | null;
  notes_conges_maternite: number | null;
  notes_hautes_rémunérations: number | null;
  notes_promotions: number | null;
  notes_remunerations: number | null;
};
