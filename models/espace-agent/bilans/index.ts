import { clientApiEntrepriseBilans } from "#clients/api-entreprise/bilans";
import type { IAPINotRespondingError } from "#models/api-not-responding";
import type { UseCase } from "#models/use-cases";
import { verifySiren } from "#utils/helpers";
import { handleApiEntrepriseError } from "../utils";

export type IBilansProtected = {
  annee: string;
  dateArreteExercice: string;
  capaciteAutofinancement: string;
  besoinEnFondsDeRoulement: string;
  dettes4MaturiteAUnAnAuPlus: string;
  disponibilites: string;
  excedentBrutExploitation: string;
  fondsRoulementNetGlobal: string;
  ratioFondsRoulementNetGlobalSurBesoinEnFondsDeRoulement: string;
  totalDettesStables: string;
  valeurAjouteeBdf: string;
}[];

export const getBilansProtected = async (
  maybeSiren: string,
  params: { useCase?: UseCase }
): Promise<IBilansProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseBilans(siren, params.useCase).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: "BilansProtected",
    })
  );
};
