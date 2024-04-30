import { clientApiEntrepriseCarteProfessionnelleTravauxPublics } from '#clients/api-entreprise/carte-professionnelle-travaux-publics';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  EScope,
  INotAuthorized,
  hasRights,
  notAuthorized,
} from '#models/user/rights';
import { ISession } from '#models/user/session';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';
export type ICarteProfessionnelleTravauxPublics = {
  documentUrl: string;
};
export const getCarteProfessionnelleTravauxPublic = async (
  siren: Siren,
  session: ISession | null
): Promise<
  ICarteProfessionnelleTravauxPublics | IAPINotRespondingError | INotAuthorized
> => {
  if (!hasRights(session, EScope.carteProfessionnelleTravauxPublics)) {
    return notAuthorized();
  }
  return clientApiEntrepriseCarteProfessionnelleTravauxPublics(
    siren,
    session?.user?.siret
  ).catch((error) => handleApiEntrepriseError(error, { siren }));
};
