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
}

export interface IActesRNE {
  actes: IActeRNE[];
  bilans: IBilanRNE[];
  hasBilanConsolide: boolean;
}

export interface IEtatCivil {
  sexe: 'M' | 'F' | null;
  nom: string;
  prenom: string;
  prenoms: string;
  role: string;
  lieuNaissance: string;
  dateNaissancePartial?: string;
  dateNaissance?: string;
  nationalite?: string;
  isInInpi?: boolean;
  isInIg?: boolean;
}

export type IEtatCivilAfterInpiIgMerge = Omit<IEtatCivil, 'role'> & {
  roles: IRole[];
};

export interface IPersonneMorale {
  siren: string;
  denomination: string;
  natureJuridique: string | null;
  role: string;
  isInInpi?: boolean;
  isInIg?: boolean;
}

export type IPersonneMoraleAfterInpiIgMerge = Omit<IPersonneMorale, 'role'> & {
  roles: IRole[];
};

export type IObservations = {
  numObservation: string;
  dateAjout: string;
  description: string;
}[];

export interface IObservationsWithMetadata {
  data: IObservations;
  metadata: {
    isFallback: boolean;
  };
}

export type IDirigeants = (IEtatCivil | IPersonneMorale)[];
export type IDirigeantsAfterInpiIgMerge = (
  | IEtatCivilAfterInpiIgMerge
  | IPersonneMoraleAfterInpiIgMerge
)[];

export interface IDirigeantsWithMetadata {
  data: IDirigeants;
  metadata: {
    isFallback: boolean;
  };
}

export interface IDirigeantsWithMetadataAfterInpiIgMerge {
  data: IDirigeantsAfterInpiIgMerge;
  metadata: {
    isFallback: boolean;
  };
}

export interface IRole {
  label: string;
  isInInpi?: boolean;
  isInIg?: boolean;
}
