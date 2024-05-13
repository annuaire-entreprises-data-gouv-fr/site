import { clientApiEntrepriseCarteProfessionnelleTravauxPublics } from '#clients/api-entreprise/carte-professionnelle-travaux-publics';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ISession } from '#models/user/session';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';
export type ICarteProfessionnelleTravauxPublics = {
  documentUrl: string;
};
export const getCarteProfessionnelleTravauxPublic = async (
  siren: Siren,
  user: ISession['user'] | null
): Promise<ICarteProfessionnelleTravauxPublics | IAPINotRespondingError> => {
  return clientApiEntrepriseCarteProfessionnelleTravauxPublics(
    siren,
    user?.siret
  ).catch((error) => handleApiEntrepriseError(error, { siren }));
};
