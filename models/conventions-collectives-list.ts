import { clientIdccMetadata } from '#clients/recherche-entreprise/idcc-metadata';
import { logWarningInSentry } from '#utils/sentry';
import { IUniteLegale } from '.';

export type IConventionsCollectives = {
  [idcc: string]: IConventionCollective;
};

type IConventionCollective = {
  idcc: string;
  metadata?: IConventionCollectiveMetadata;
  sirets?: string[];
};

export type IConventionCollectiveMetadata = {
  idKali?: string | null;
  legifrance?: string | null;
  title?: string;
  nature?: string;
  etat?: string;
};

class IdccMetadata {
  private _idccMetadata = null as {
    [idcc: string]: IConventionCollectiveMetadata;
  } | null;

  get = async (idcc: string) => {
    try {
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
    } catch (e: any) {
      logWarningInSentry('Error in convention collective', {
        details: e.toString(),
      });
    }
  };
}
const IdccBuilder = new IdccMetadata();

export const getIdccWithMetadata = async (uniteLegale: IUniteLegale) => {
  if (!uniteLegale.conventionsCollectives) {
    return {};
  }

  for (let [idcc, cc] of Object.entries(uniteLegale.conventionsCollectives)) {
    uniteLegale.conventionsCollectives[idcc] = {
      ...cc,
      metadata: await IdccBuilder.get(idcc),
    };
  }
  return uniteLegale.conventionsCollectives;
};
