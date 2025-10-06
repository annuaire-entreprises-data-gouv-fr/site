import { clientRechercheEntrepriseLastModified } from "#clients/recherche-entreprise/last-modified";
import logErrorInSentry from "#utils/sentry";
import { FetchRechercheEntrepriseException } from "./core/types";

export interface IRechercheEntrepriseSourcesLastModified {
  rne: string | null;
  idcc: string | null;
}

/**
 * Return the last modified dates for a selections of sources used directly in the site :
 * IDCC and RNE are directly use from recherche entreprise
 */
export const getRechercheEntrepriseSourcesLastModified =
  async (): Promise<IRechercheEntrepriseSourcesLastModified> => {
    try {
      return await clientRechercheEntrepriseLastModified();
    } catch (e: any) {
      logErrorInSentry(
        new FetchRechercheEntrepriseException({
          cause: e,
          message: "Could not fetch sources’s last modified dates",
        })
      );
      return { rne: null, idcc: null };
    }
  };
