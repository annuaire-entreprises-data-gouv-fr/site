import { clientApiEntrepriseCibtp } from '#clients/api-entreprise/cibtp';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type ICibtp = {
  documentUrl: string;
  expiresIn: number;
};

export const getCibtp = async (
  maybeSiret: string
): Promise<ICibtp | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseCibtp(siret).catch((error) =>
    handleApiEntrepriseError(error, { siret, apiResource: 'Cibtp' })
  );
};
