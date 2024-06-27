import { clientEORI } from '#clients/api-proxy/eori';
import { verifySiret } from '#utils/helpers';
import { EAdministration } from './administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';

export type IEORIValidation = {
  eori: string;
  isValid: boolean;
};

export const getEORIValidation = async (
  eori: string
): Promise<IEORIValidation | IAPINotRespondingError> => {
  try {
    const siret = verifySiret(eori);
    const data = await clientEORI(siret);
    if (!data) {
      return APINotRespondingFactory(EAdministration.DOUANES, 500);
    }
    return data;
  } catch (e: any) {
    console.error(e);
    return APINotRespondingFactory(EAdministration.DOUANES, e.status || 500);
  }
};
