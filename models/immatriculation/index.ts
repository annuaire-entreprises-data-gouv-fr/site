import { Siren } from '#utils/helpers';

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
}

export interface IBeneficiaire {
  type: string;
  nom: string;
  prenoms: string;
  dateNaissancePartial: string;
  nationalite: string;
  dateGreffe: string;
}
export interface IIdentite {
  denomination: string;
  dateImmatriculation: string;
  dateDebutActiv: string;
  dateRadiation: string;
  dateCessationActivite: string;
  isPersonneMorale: boolean;
  dateClotureExercice: string;
  dureePersonneMorale: string;
  capital: string;
  libelleNatureJuridique: string;
  natureEntreprise?: string;
}

export interface IPersonneMorale {
  siren: string;
  denomination: string;
  natureJuridique: string | null;
  role: string;
}

export interface IImmatriculationRNE {
  siren: Siren;
  identite: IIdentite;
  beneficiaires: IBeneficiaire[];
  dirigeants: (IEtatCivil | IPersonneMorale)[];
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
