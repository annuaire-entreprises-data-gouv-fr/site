import { clientApiEntrepriseCarteProfessionnelleTravauxPublics } from '#clients/api-entreprise/carte-professionnelle-travaux-publics';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { extractSirenFromSiret, verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';
export type ICarteProfessionnelleTravauxPublics = {
  documentUrl: string;
};
export const getCarteProfessionnelleTravauxPublic = async (
  slug: string
): Promise<ICarteProfessionnelleTravauxPublics | IAPINotRespondingError> => {
  const siret = verifySiret(slug as string);
  const siren = extractSirenFromSiret(siret);
  return clientApiEntrepriseCarteProfessionnelleTravauxPublics(siren).catch(
    (error) =>
      handleApiEntrepriseError(error, {
        siren,
        apiResource: 'CarteProfessionnelleTravauxPublics',
      })
  );
};
