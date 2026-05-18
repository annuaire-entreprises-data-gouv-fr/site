interface IActeRNE {
  dateDepot: string;
  detailsDocuments: { nom: string; label: string }[];
  id: string;
}

interface IBilanRNE {
  confidentiality: string;
  dateCloture: string;
  dateDepot: string;
  id: string;
  typeBilan: string;
}

export interface IDocumentsRNE {
  actes: IActeRNE[];
  bilans: IBilanRNE[];
  hasBilanConsolide: boolean;
}

export interface IEtatCivil {
  dateDemission: string | null;
  dateNaissance?: string;
  dateNaissancePartial?: string;
  estDemissionnaire: boolean;
  lieuNaissance?: string;
  nationalite?: string;
  nom: string;
  prenom: string;
  prenoms: string;
  role: string | null;
  sexe: "M" | "F" | null;
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
  denomination: string;
  natureJuridique: string | null;
  role: string | null;
  siren: string;
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
  isInIg?: boolean;
  isInInpi?: boolean;
  label: string;
}
