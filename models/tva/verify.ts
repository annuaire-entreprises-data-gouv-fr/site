import { TVAUserException, clientTVA } from '#clients/api-vies';
import { HttpConnectionReset } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { FetchRessourceException, IExceptionContext } from '#models/exceptions';
import { verifySiren, verifyTVANumber } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';
import { tvaNumber } from './utils';

export const buildAndVerifyTVA = async (
  slug: string
): Promise<string | null> => {
  const siren = verifySiren(slug);
  const tvaNumberFromSiren = verifyTVANumber(tvaNumber(siren));

  try {
    return await clientTVA(tvaNumberFromSiren);
  } catch (eFirstTry: any) {
    if (eFirstTry instanceof TVAUserException) {
      throw eFirstTry;
    }
    const message =
      eFirstTry instanceof HttpConnectionReset
        ? 'ECONNRESET in API TVA : retrying'
        : 'Error in API TVA : retrying';
    logWarningInSentry(
      new FetchVerifyTVAException({
        message,
        cause: eFirstTry,
        context: { siren },
      })
    );
    throw eFirstTry;
  }
};

type IFetchEtablissementExceptionArgs = {
  message?: string;
  cause?: any;
  context?: IExceptionContext;
};
export class FetchVerifyTVAException extends FetchRessourceException {
  constructor(args: IFetchEtablissementExceptionArgs) {
    super({
      ressource: 'VerifyTVA',
      administration: EAdministration.VIES,
      ...args,
    });
  }
}
