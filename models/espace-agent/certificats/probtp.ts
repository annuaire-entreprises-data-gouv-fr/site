import { clientApiEntrepriseProbtp } from '#clients/api-entreprise/certificats/probtp';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type IProbtp = {
  documentUrl: string;
  expiresIn: number;
};

export const getProbtp = async (
  maybeSiret: string
): Promise<IProbtp | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseProbtp(siret).catch((error) =>
    handleApiEntrepriseError(error, { siret, apiResource: 'Probtp' })
  );
};
