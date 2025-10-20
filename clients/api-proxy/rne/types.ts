export type IRNEEtatCivilProxyResponse = {
  nom: string;
  prenom: string;
  role: string;
  dateNaissancePartial: string;
  estDemissionnaire: boolean;
  dateDemission: string | null;
};
export type IRNEPersonneMoraleProxyResponse = {
  denomination: string;
  natureJuridique: string;
  role: string;
  siren: string;
};
type IRNEIdentiteProxyResponse = {
  capital: string;
  dateCessationActivite: string;
  dateClotureExercice: string;
  dateDebutActiv: string;
  dateImmatriculation: string;
  dateRadiation: string;
  denomination: string;
  dureePersonneMorale: number;
  isPersonneMorale: boolean;
  libelleNatureJuridique: string;
  natureEntreprise: string;
};
export type IRNEObservationsProxyResponse = {
  dateAjout: string;
  description: string;
  numObservation: string;
}[];

export type IRNEProxyResponse = {
  identite: IRNEIdentiteProxyResponse;
  observations: IRNEObservationsProxyResponse;
  dirigeants: (IRNEPersonneMoraleProxyResponse | IRNEEtatCivilProxyResponse)[];
};

export type IRNEObservationsFallbackProxyResponse =
  IRNEObservationsProxyResponse;
