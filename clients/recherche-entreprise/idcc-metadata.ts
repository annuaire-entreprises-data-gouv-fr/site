import { HttpServerError } from '#clients/exceptions';
import routes from '#clients/routes';
import { ICCWithMetadata } from '#models/conventions-collectives-list';
import { httpGet } from '#utils/network';

type IIdccMetadata = {
  [idcc: string]: {
    'titre de la convention': string; //Convention collective na… des cabinets d'avocats
    id_kali: string; //KALICONT000005635185
    cc_ti: string; //IDCC
    nature: string; //CONVENTION COLLECTIVE NATIONALE
    etat: string; //VIGUEUR_ETEN
    debut: string; //1979-03-01 00:00:00
    fin: string | null;
    url: string; //https://www.legifrance.g…/id/KALICONT000005635185
  };
};

class IdCCMetadataClient {
  private _idccMetadata = null as {
    [idcc: string]: ICCWithMetadata;
  } | null;

  get = async (idcc: string) => {
    if (!this._idccMetadata) {
      const response = await httpGet<IIdccMetadata>(
        routes.conventionsCollectives.metadata
      );

      this._idccMetadata = this.mapToDomainObject(response);
    }

    if (Object.values(this._idccMetadata).length === 0) {
      throw new HttpServerError('Empty Idcc metadata list');
    }

    if (idcc in this._idccMetadata) {
      return this._idccMetadata[idcc] || {};
    } else {
      return null;
    }
  };

  mapToDomainObject = (response: IIdccMetadata) => {
    return Object.entries(response).reduce(
      (idccMetadatas, [idcc, metadata]) => {
        const { id_kali, url, nature, etat } = metadata;
        idccMetadatas[idcc] = {
          idKali: id_kali,
          legifrance: url,
          title: metadata['titre de la convention'],
          nature,
          etat,
          idcc,
        };
        return idccMetadatas;
      },
      {} as { [idcc: string]: ICCWithMetadata }
    );
  };
}
const client = new IdCCMetadataClient();

export const clientIdccMetadata = async (idcc: string) => client.get(idcc);
