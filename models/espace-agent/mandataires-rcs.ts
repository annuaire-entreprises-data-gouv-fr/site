import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation';
import { Siren, Siret } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getMandatairesRCS = async (
  siren: Siren,
  userSiret?: Siret
): Promise<Array<IDirigeant> | IAPINotRespondingError> => {
  return clientApiEntrepriseMandatairesRCS(siren, userSiret).catch((error) =>
    handleApiEntrepriseError(error, { siren })
  );
};
