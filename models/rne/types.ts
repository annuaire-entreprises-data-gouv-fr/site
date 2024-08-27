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
  role: string;
  lieuNaissance: string;
  dateNaissancePartial?: string;
  dateNaissance?: string;
  nationalite?: string;
}

export interface IPersonneMorale {
  siren: string;
  denomination: string;
  natureJuridique: string | null;
  role: string;
}

export interface IObservations {
  observations: {
    numObservation: string;
    dateAjout: string;
    description: string;
  }[];
  metadata: {
    isFallback: boolean;
  };
}

export interface IDirigeants {
  data: (IEtatCivil | IPersonneMorale)[];
  metadata?: {
    isFallback: boolean;
  };
}
