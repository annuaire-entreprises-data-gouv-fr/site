import { clientApiEntrepriseDgfipLiassesFiscales } from '#clients/api-entreprise/liasses-fiscales';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type ILiassesFiscalesProtected = {
  obligationsFiscales: string[];
  declarations: {
    imprime: string;
    regime: any;
    dureeExercice: number;
    dateFinExercice: string;
    donnees: {
      intitule: string;
      valeurs: string[];
    }[];
  }[];
};

export const getLiassesFiscalesProtected = async (
  maybeSiren: string,
  params: { year: string }
): Promise<ILiassesFiscalesProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseDgfipLiassesFiscales(siren, params.year).catch(
    (error) =>
      handleApiEntrepriseError(error, {
        siren,
        apiResource: 'getLiassesFiscalesProtected',
      })
  );
};
