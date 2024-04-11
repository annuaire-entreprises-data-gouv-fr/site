import { clientIdccMetadata } from '#clients/metadata-store/idcc';
import logErrorInSentry from '#utils/sentry';
import { EAdministration } from '../administrations/EAdministration';
import { APINotRespondingFactory } from '../api-not-responding';
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

export const getCCMetadata = async (cc: IConventionsCollectives) => {
  try {
    const metadata = [] as ICCWithMetadata[];
    for (let [idcc, sirets] of Object.entries(cc)) {
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
          details: Object.keys(cc).join(', '),
        },
      })
    );
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
