import { clientApiEntrepriseMandatairesRCS } from '#clients/api-entreprise/mandataires-rcs';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IDirigeant } from '#models/immatriculation';
import { Siren } from '#utils/helpers';
import { handleApiEntrepriseError } from './utils';

export const getMandatairesRCS = async (
  siren: Siren
): Promise<Array<IDirigeant> | IAPINotRespondingError> => {
  return clientApiEntrepriseMandatairesRCS(siren).catch((error) =>
    handleApiEntrepriseError(error, { siren, apiResource: 'MadatairesRCS' })
  );
};
