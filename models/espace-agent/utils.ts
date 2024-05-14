import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import { APINotRespondingFactory } from '#models/api-not-responding';
import { FetchRessourceException, IExceptionContext } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';

export function handleApiEntrepriseError(e: any, context: IExceptionContext) {
  if (e instanceof HttpNotFound) {
    return APINotRespondingFactory(EAdministration.DINUM, 404);
  }

  logErrorInSentry(
    new FetchRessourceException({
      cause: e,
      ressource: 'APIEntreprise',
      context,
      administration: EAdministration.DINUM,
    })
  );
  return APINotRespondingFactory(EAdministration.DINUM, e.status || 500);
}
