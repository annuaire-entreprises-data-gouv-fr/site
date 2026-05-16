export interface IEgaproRepresentationResponse {
  count: number;
  data: IEgaproRepresentationItem[];
}

export interface IEgaproRepresentationItem {
  entreprise: {
    raison_sociale: string;
    siren: string;
    région: string;
    département: string;
    code_naf: string;
  };
  label: string;
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
}

export interface IEgaproResponse {
  count: number;
  data?: IEgaproItem[] | null;
}

export interface IEgaproItem {
  entreprise: {
    raison_sociale: string;
    siren: string;
    région?: string | null;
    département?: string | null;
    code_naf: string;
    ues?: IUes | null;
    effectif: {
      tranche: "50:250" | "251:999" | "1000:";
    };
  };
  label: string;
  notes: { [key: string]: number };
  notes_augmentations: { [key: string]: number };
  notes_augmentations_et_promotions: { [key: string]: number };
  notes_conges_maternite: { [key: string]: number };
  notes_hautes_rémunérations: { [key: string]: number };
  notes_promotions: { [key: string]: number };
  notes_remunerations: { [key: string]: number };
}

export interface IUes {
  entreprises?:
    | {
        raison_sociale: string;
        siren: string;
      }[]
    | null;
  nom: string;
}

export interface IEgaproScore {
  annee: string | null;
  notes: number | null;
  notes_augmentations: number | null;
  notes_augmentations_et_promotions: number | null;
  notes_conges_maternite: number | null;
  notes_hautes_rémunérations: number | null;
  notes_promotions: number | null;
  notes_remunerations: number | null;
}

export interface IEgaproRepresentation {
  scores: {
    pourcentageFemmesCadres: number[];
    pourcentageHommesCadres: number[];
    pourcentageFemmesMembres: number[];
    pourcentageHommesMembres: number[];
  };
  years: string[];
}
