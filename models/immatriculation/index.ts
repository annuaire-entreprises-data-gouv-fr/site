import { Siren } from '#utils/helpers';

interface IActeRNE {
  id: string;
  dateDepot: string;
  actes?: string[];
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

export interface IImmatriculation {
  downloadLink: string;
  siteLink: string;
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

export type IDirigeant = IEtatCivil | IPersonneMorale;

export interface IImmatriculationRNE extends IImmatriculation {
  siren: Siren;
  identite: IIdentite;
  dirigeants: IDirigeant[];
  beneficiaires: IBeneficiaire[];
  metadata: {
    isFallback: boolean;
  };
  observations: {
    numObservation: string;
    dateAjout: string;
    description: string;
  }[];
}
