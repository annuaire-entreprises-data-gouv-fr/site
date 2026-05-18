export interface IRNEEtatCivilProxyResponse {
  dateDemission: string | null;
  dateNaissancePartial: string;
  estDemissionnaire: boolean;
  nom: string;
  prenom: string;
  role: string;
}
export interface IRNEPersonneMoraleProxyResponse {
  denomination: string;
  natureJuridique: string;
  role: string;
  siren: string;
}
export type IRNEObservationsProxyResponse = {
  dateAjout: string;
  description: string;
  numObservation: string;
}[];

export interface IRNEProxyResponse {
  dirigeants: (IRNEPersonneMoraleProxyResponse | IRNEEtatCivilProxyResponse)[];
  observations: IRNEObservationsProxyResponse;
}

export type IRNEObservationsFallbackProxyResponse =
  IRNEObservationsProxyResponse;
