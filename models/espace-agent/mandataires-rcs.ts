import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation';
import { ISession } from '#models/user/session';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getMandatairesRCS = async (
  siren: Siren,
  user: ISession['user'] | null
): Promise<Array<IDirigeant> | IAPINotRespondingError> => {
  return clientApiEntrepriseMandatairesRCS(siren, user?.siret).catch((error) =>
    handleApiEntrepriseError(error, { siren })
  );
};
