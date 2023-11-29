import { clientIdccMetadata } from '#clients/recherche-entreprise/idcc-metadata';
import logErrorInSentry from '#utils/sentry';
import { EAdministration } from './administrations';
import { APINotRespondingFactory } from './api-not-responding';

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

class CCMetadata {
  private _idccMetadata = null as {
    [idcc: string]: ICCWithMetadata;
  } | null;

  get = async (idcc: string) => {
    if (!this._idccMetadata) {
      this._idccMetadata = await clientIdccMetadata();
    }

    if (Object.values(this._idccMetadata).length === 0) {
      throw new Error('Empty Idcc metadata list');
    }

    if (idcc in this._idccMetadata) {
      return this._idccMetadata[idcc] || {};
    } else {
      throw new Error('Convention collective not found');
    }
  };
}
const CCMetadataStore = new CCMetadata();

export const getCCMetadata = async (cc: IConventionsCollectives) => {
  if (Object.keys(cc).length === 0) {
    return APINotRespondingFactory(EAdministration.MTPEI, 404);
  }

  try {
    const metadata = [] as ICCWithMetadata[];
    for (let [idcc, sirets] of Object.entries(cc)) {
      metadata.push({
        sirets,
        ...(await CCMetadataStore.get(idcc)),
      });
    }
    return metadata;
  } catch (e: any) {
    logErrorInSentry(e, {
      errorName: 'Error in convention collective',
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
