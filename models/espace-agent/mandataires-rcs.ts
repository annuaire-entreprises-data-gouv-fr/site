import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getMandatairesRCS = async (
  maybeSiren: string
): Promise<Array<IDirigeant> | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  console.log(maybeSiren);
  try {
    const mandatairesRCS = await clientApiEntrepriseMandatairesRCS(siren);
    if (mandatairesRCS.length === 0) {
      return APINotRespondingFactory(EAdministration.INFOGREFFE, 404);
    }
    return mandatairesRCS;
  } catch (error) {
    return handleApiEntrepriseError(error, {
      siren,
      apiResource: 'MadatairesRCS',
    });
  }
};
