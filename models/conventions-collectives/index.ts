import { clientIdccRechercheEntreprise } from "#clients/recherche-entreprise/idcc";
import { clientIdccMetadata } from "#clients/recherche-entreprise/idcc-metadata";
import type { Siren } from "#utils/helpers";
import logErrorInSentry from "#utils/sentry";
import { EAdministration } from "../administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "../api-not-responding";
import { FetchRessourceException } from "../exceptions";
import { idccUpdates } from "./idcc-updates";

export interface IConventionsCollectives {
  [idcc: string]: string[];
}

export interface ICCWithMetadata {
  etat?: string;
  idcc?: string;
  idKali?: string | null;
  legifrance?: string | null;
  nature?: string;
  sirets?: string[];
  title?: string;
  unknown: boolean;
  updated: ICCWithMetadata[];
}

/**
 * Get title from metadata for a single idcc
 * @param siren
 * @param idcc
 * @returns
 */
export const getIdccTitle = async (siren: Siren, idcc: string) => {
  try {
    const metadata = await clientIdccMetadata(idcc);
    return { idcc, title: metadata.title || "" };
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Convention Collective",
        context: {
          siren,
        },
      })
    );
    // when metadata fails we intentionnally ignore failure
    return { idcc, title: "" };
  }
};

/**
 * Get all idcc and their metadata for a given siren
 * @param siren
 * @returns
 */
export const getAllIdccWithMetadata = async (
  siren: Siren
): Promise<ICCWithMetadata[] | IAPINotRespondingError> => {
  try {
    const allIdcc = await clientIdccRechercheEntreprise(siren);

    const metadata = [] as ICCWithMetadata[];

    for (const [idcc, sirets] of Object.entries(allIdcc)) {
      const idccMetadata = await clientIdccMetadata(idcc);

      const updates = idccUpdates(idcc);
      const updated = await Promise.all(
        updates.map((cc) => clientIdccMetadata(cc))
      );

      metadata.push({
        sirets,
        ...idccMetadata,
        updated,
      });
    }
    return metadata;
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Convention Collective",
        context: {
          siren,
        },
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};
