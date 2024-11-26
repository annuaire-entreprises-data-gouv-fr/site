import { clientRechercheEntrepriseLastModified } from '#clients/recherche-entreprise/source-last-modified';
import logErrorInSentry from '#utils/sentry';
import { FetchRechercheEntrepriseException } from './core/types';

export interface ISourcesLastModified {
  rne: string | null;
  insee: string | null;
  idcc: string | null;
}

/**
 * Get main sources last modified dates in recherche entreprise index
 */
export const getSourcesLastModifiedDates =
  async (): Promise<ISourcesLastModified> => {
    try {
      return {
        rne: (await clientRechercheEntrepriseLastModified('rne')) ?? null,
        insee: (await clientRechercheEntrepriseLastModified('sirene')) ?? null,
        idcc:
          (await clientRechercheEntrepriseLastModified(
            'convention_collective'
          )) ?? null,
      };
    } catch (e: any) {
      logErrorInSentry(
        new FetchRechercheEntrepriseException({
          cause: e,
          message: 'Could not fetch sources’s last modified dates',
        })
      );
      return { rne: null, insee: null, idcc: null };
    }
  };
