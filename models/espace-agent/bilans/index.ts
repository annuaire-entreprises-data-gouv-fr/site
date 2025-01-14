import { clientApiEntrepriseBilans } from '#clients/api-entreprise/bilans';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

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
  maybeSiren: string
): Promise<IBilansProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseBilans(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'BilansProtected',
    })
  );
};
