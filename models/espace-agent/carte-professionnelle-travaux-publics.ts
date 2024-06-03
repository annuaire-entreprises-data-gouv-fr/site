import { clientApiEntrepriseCarteProfessionnelleTravauxPublics } from '#clients/api-entreprise/carte-professionnelle-travaux-publics';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { Siren, Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';
export type ICarteProfessionnelleTravauxPublics = {
  documentUrl: string;
};
export const getCarteProfessionnelleTravauxPublic = async (
  siren: Siren,
  siret?: Siret
): Promise<ICarteProfessionnelleTravauxPublics | IAPINotRespondingError> => {
  return clientApiEntrepriseCarteProfessionnelleTravauxPublics(
    siren,
    siret
  ).catch((error) => handleApiEntrepriseError(error, { siren }));
};
