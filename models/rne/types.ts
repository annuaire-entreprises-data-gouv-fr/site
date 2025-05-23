interface IActeRNE {
  id: string;
  dateDepot: string;
  detailsDocuments: { nom: string; label: string }[];
}

interface IBilanRNE {
  id: string;
  dateDepot: string;
  dateCloture: string;
  typeBilan: string;
  confidentiality: string;
}

export interface IDocumentsRNE {
  actes: IActeRNE[];
  bilans: IBilanRNE[];
  hasBilanConsolide: boolean;
}

export interface IEtatCivil {
  sexe: 'M' | 'F' | null;
  nom: string;
  prenom: string;
  prenoms: string;
  role: string | null;
  lieuNaissance?: string;
  dateNaissancePartial?: string;
  dateNaissance?: string;
  nationalite?: string;
}

export type IEtatCivilLiensCapitalistiques = IEtatCivil & {
  pourcentage: number;
  nombre_parts: number;
  pays: string;
};

export type IEtatCivilMergedIGInpi = IEtatCivil & {
  roles: IRole[];
  isInInpi: boolean;
  isInIg: boolean;
};

export interface IPersonneMorale {
  siren: string;
  denomination: string;
  natureJuridique: string | null;
  role: string | null;
}

export type IPersonneMoraleMergedIGInpi = IPersonneMorale & {
  roles: IRole[];
  isInInpi: boolean;
  isInIg: boolean;
};

export type IPersonneMoraleLiensCapitalistiques = IPersonneMorale & {
  pourcentage: number;
  nombre_parts?: number;
  pays: string;
};

export type IObservations = {
  dateAjout: string;
  description: string;
  numObservation: string;
}[];

export interface IObservationsWithMetadata {
  data: IObservations;
  metadata: {
    isFallback: boolean;
  };
}

export type IDirigeants = (IEtatCivil | IPersonneMorale)[];
export type IDirigeantsMergedIGInpi = (
  | IEtatCivilMergedIGInpi
  | IPersonneMoraleMergedIGInpi
)[];

export interface IDirigeantsWithMetadata {
  data: IDirigeants;
  metadata: {
    isFallback: boolean;
  };
}

export interface IDirigeantsWithMetadataMergedIGInpi {
  data: IDirigeantsMergedIGInpi;
  metadata: {
    isFallback: boolean;
  };
}

export interface IRole {
  label: string;
  isInInpi?: boolean;
  isInIg?: boolean;
}
