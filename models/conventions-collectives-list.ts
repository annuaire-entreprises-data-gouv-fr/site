import { clientIdccMetadata } from '#clients/recherche-entreprise/idcc-metadata';
import logErrorInSentry from '#utils/sentry';
import { EAdministration } from './administrations/EAdministration';
import { APINotRespondingFactory } from './api-not-responding';
import { FetchRessourceException } from './exceptions';

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
};

export const getCCMetadata = async (cc: IConventionsCollectives) => {
  try {
    const metadata = [] as ICCWithMetadata[];
    for (let [idcc, sirets] of Object.entries(cc)) {
      metadata.push({
        sirets,
        ...(await clientIdccMetadata(idcc)),
      });
    }
    return metadata;
  } catch (e: any) {
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'Convention Collective',
        context: {
          details: Object.keys(cc).join(''),
        },
      })
    );
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
