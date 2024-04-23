import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation';
import {
  EScope,
  INotAuthorized,
  hasRights,
  notAuthorized,
} from '#models/user/rights';
import { ISession } from '#models/user/session';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getMandatairesRCS = async (
  siren: Siren,
  session: ISession | null
): Promise<Array<IDirigeant> | IAPINotRespondingError | INotAuthorized> => {
  if (!hasRights(session, EScope.mandatairesRCS)) {
    return notAuthorized();
  }
  return clientApiEntrepriseMandatairesRCS(siren).catch((error) =>
    handleApiEntrepriseError(error, { siren })
  );
};
