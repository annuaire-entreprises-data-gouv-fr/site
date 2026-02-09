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
export type IRNEObservationsProxyResponse = {
  dateAjout: string;
  description: string;
  numObservation: string;
}[];

export type IRNEProxyResponse = {
  observations: IRNEObservationsProxyResponse;
  dirigeants: (IRNEPersonneMoraleProxyResponse | IRNEEtatCivilProxyResponse)[];
};

export type IRNEObservationsFallbackProxyResponse =
  IRNEObservationsProxyResponse;
