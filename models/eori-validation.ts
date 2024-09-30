import { clientEORI } from '#clients/api-proxy/eori';
import { verifySiret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { EAdministration } from './administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from './api-not-responding';
import { FetchRessourceException } from './exceptions';

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
      return { eori, isValid: false };
    }
    return data;
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'EORIValidation',
        cause: e,
        context: { slug: eori },
      })
    );
    return APINotRespondingFactory(EAdministration.DOUANES, e.status || 500);
  }
};
