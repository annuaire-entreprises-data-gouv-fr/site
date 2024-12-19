import { clientApiEntrepriseBanqueDeFranceBilans } from '#clients/api-entreprise/banque-de-france/bilans';
import { IAPIEntrepriseBanqueDeFranceBilans } from '#clients/api-entreprise/banque-de-france/types';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

// TEMP
export type IBanqueDeFranceBilansProtected = IAPIEntrepriseBanqueDeFranceBilans;

export const getBanqueDeFranceBilansProtected = async (
  maybeSiren: string
): Promise<IBanqueDeFranceBilansProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseBanqueDeFranceBilans(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'getBanqueDeFranceBilansProtected',
    })
  );
};
