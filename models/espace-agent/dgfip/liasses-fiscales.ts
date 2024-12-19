import { clientApiEntrepriseDgfipLiassesFiscales } from '#clients/api-entreprise/dgfip/liasses-fiscales';
import { IAPIEntrepriseDgfipLiassesFiscales } from '#clients/api-entreprise/dgfip/types';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

// TEMP
export type IDgfipLiassesFiscalesProtected = IAPIEntrepriseDgfipLiassesFiscales;

export const getDgfipLiassesFiscalesProtected = async (
  maybeSiren: string
): Promise<IDgfipLiassesFiscalesProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseDgfipLiassesFiscales(siren).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'getDgfipLiassesFiscalesProtected',
    })
  );
};
