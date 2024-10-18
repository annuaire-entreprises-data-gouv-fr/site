import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import { IDirigeants } from '#models/rne/types';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getRCSRNEDirigeants = async (
  maybeSiren: string
): Promise<IDirigeants | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  try {
    const mandatairesRCS = await clientApiEntrepriseMandatairesRCS(siren);
    if (mandatairesRCS.data.length !== 0) {
      return mandatairesRCS;
    }

    return getDirigeantsRNE(maybeSiren);
  } catch (error) {
    return handleApiEntrepriseError(error, {
      siren,
      apiResource: 'RCSRNEDirigeants',
    });
  }
};
