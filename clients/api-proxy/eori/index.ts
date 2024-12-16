import routes from '#clients/routes';
import constants from '#models/constants';
import { IEORIValidation } from '#models/eori-validation';
import { Siret } from '#utils/helpers';
import { clientAPIProxy } from '../client';

/**
 * Call EORI to validate a French EORI number
 * @param siret
 */
export const clientEORI = async (siret: Siret): Promise<IEORIValidation> => {
  return await clientAPIProxy<IEORIValidation>(routes.proxy.eori(siret), {
    timeout: constants.timeout.XXL,
  });
};
