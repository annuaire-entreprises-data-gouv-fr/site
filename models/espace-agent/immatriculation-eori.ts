import { clientApiEntrepriseImmatriculationEORI } from '#clients/api-entreprise/immatriculation-eori';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ISession } from '#models/user/session';
import { Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export type IImmatriculationEORI = {
  identifiantEORI: string;
  actif: boolean;
  codePays: string;
};

export const getImmatriculationEORI = async (
  siret: Siret,
  user: ISession['user'] | null
): Promise<IImmatriculationEORI | IAPINotRespondingError> => {
  return clientApiEntrepriseImmatriculationEORI(siret, user?.siret).catch(
    (error) => handleApiEntrepriseError(error, { siret })
  );
};
