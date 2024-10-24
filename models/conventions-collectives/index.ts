import { clientIdccMetadata } from '#clients/metadata-store/idcc';
import { clientIdccRechercheEntreprise } from '#clients/recherche-entreprise/idcc';
import { Siren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { EAdministration } from '../administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '../api-not-responding';
import { FetchRessourceException } from '../exceptions';
import { idccUpdates } from './idcc-updates';

export type IConventionsCollectives = {
  [idcc: string]: string[];
};

export type ICCWithMetadata = {
  idKali?: string | null;
  legifrance?: string | null;
  title?: string;
  nature?: string;
  etat?: string;
  sirets?: string[];
  idcc?: string;
  updated: ICCWithMetadata[];
  unknown: boolean;
};

export const getAllIdccWithMetadata = async (
  siren: Siren
): Promise<ICCWithMetadata[] | IAPINotRespondingError> => {
  try {
    const allIdcc = await clientIdccRechercheEntreprise(siren);

    const metadata = [] as ICCWithMetadata[];

    for (let [idcc, sirets] of Object.entries(allIdcc)) {
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
        ressource: 'Convention Collective',
        context: {
          siren,
        },
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};
