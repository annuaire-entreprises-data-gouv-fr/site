export type IEgaproRepresentationResponse = {
  data: {
    entreprise: {
      raison_sociale: string;
      siren: string;
      région: string;
      département: string;
      code_naf: string;
    };
    représentation_équilibrée: {
      [year: string]: {
        pourcentage_femmes_cadres: number;
        pourcentage_hommes_cadres: number;
        pourcentage_femmes_membres: number;
        pourcentage_hommes_membres: number;
        motif_non_calculabilité_cadres: null;
        motif_non_calculabilité_membres: null;
      };
    };
    label: string;
  }[];
  count: number;
};
export type IEgaproRepresentationResponseItem = {
  entreprise: {
    raison_sociale: string;
    siren: string;
    région: string;
    département: string;
    code_naf: string;
  };
  représentation_équilibrée: {
    [year: string]: {
      pourcentage_femmes_cadres: number;
      pourcentage_hommes_cadres: number;
      pourcentage_femmes_membres: number;
      pourcentage_hommes_membres: number;
      motif_non_calculabilité_cadres: null;
      motif_non_calculabilité_membres: null;
    };
  };
  label: string;
};

export type IEgaproResponse = {
  data?: IEgaproItem[] | null;
  count: number;
};

export type IEgaproItem = {
  entreprise: {
    raison_sociale: string;
    siren: string;
    région?: string | null;
    département?: string | null;
    code_naf: string;
    ues?: IUes | null;
    effectif: {
      tranche: '50:250' | '251:999' | '1000:';
    };
  };
  notes: { [key: string]: number };
  notes_remunerations: { [key: string]: number };
  notes_augmentations: { [key: string]: number };
  notes_promotions: { [key: string]: number };
  notes_augmentations_et_promotions: { [key: string]: number };
  notes_conges_maternite: { [key: string]: number };
  notes_hautes_rémunérations: { [key: string]: number };
  label: string;
};

export type IUes = {
  nom: string;
  entreprises?:
    | {
        raison_sociale: string;
        siren: string;
      }[]
    | null;
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
