import { clientApiEntrepriseCarteProfessionnelleTravauxPublics } from '#clients/api-entreprise/carte-professionnelle-travaux-publics';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';
export type ICarteProfessionnelleTravauxPublics = {
  documentUrl: string;
};
export const getCarteProfessionnelleTravauxPublic = async (
  siren: Siren
): Promise<ICarteProfessionnelleTravauxPublics | IAPINotRespondingError> => {
  return clientApiEntrepriseCarteProfessionnelleTravauxPublics(siren).catch(
    (error) =>
      handleApiEntrepriseError(error, {
        siren,
        apiResource: 'CarteProfessionnelleTravauxPublics',
      })
  );
};
