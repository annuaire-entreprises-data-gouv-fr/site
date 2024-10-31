import { clientApiEntrepriseCnetp } from '#clients/api-entreprise/cnetp';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type ICnetp = {
  documentUrl: string;
  expiresIn: number;
};

export const getCnetp = async (
  maybeSiren: string
): Promise<ICnetp | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseCnetp(siren).catch((error) =>
    handleApiEntrepriseError(error, { siren, apiResource: 'Cnetp' })
  );
};
