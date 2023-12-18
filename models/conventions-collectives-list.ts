import { clientIdccMetadata } from '#clients/recherche-entreprise/idcc-metadata';
import logErrorInSentry, { logInfoInSentry } from '#utils/sentry';
import { EAdministration } from './administrations/EAdministration';
import { APINotRespondingFactory } from './api-not-responding';
import { FetchRessourceException, Information } from './exceptions';

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

const unknonwCC = {
  idKali: '',
  legifrance: '',
  title:
    'Cette convention collective n’apparait pas dans la nomenclature officielle du ministère du travail.',
  nature: 'Convention collective inconnue',
  etat: '',
  idcc: '',
};

export const getCCMetadata = async (cc: IConventionsCollectives) => {
  try {
    const metadata = [] as ICCWithMetadata[];
    for (let [idcc, sirets] of Object.entries(cc)) {
      const idccMetadata = await clientIdccMetadata(idcc);

      if (!idccMetadata) {
        logInfoInSentry(
          new Information({
            name: 'UnknownConventionCollective',
            message: `Convention Collective inconnue : ${idcc}`,
          })
        );
      }

      metadata.push({
        sirets,
        ...(idccMetadata || { ...unknonwCC, idcc }),
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
