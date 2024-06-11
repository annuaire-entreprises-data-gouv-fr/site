import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getMandatairesRCS = async (
  maybeSiren: string
): Promise<Array<IDirigeant> | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);

  return clientApiEntrepriseMandatairesRCS(siren).catch((error) =>
    handleApiEntrepriseError(error, { siren, apiResource: 'MadatairesRCS' })
  );
};
