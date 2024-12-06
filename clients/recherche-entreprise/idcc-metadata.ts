import routes from '#clients/routes';
import { ICCWithMetadata } from '#models/conventions-collectives';
import { DataStore } from '../store';

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

function mapToDomainObject(response: IIdccMetadata) {
  return Object.entries(response).reduce((idccMetadatas, [idcc, metadata]) => {
    const { id_kali, url, nature, etat } = metadata;
    idccMetadatas[idcc] = {
      idKali: id_kali,
      legifrance: url,
      title: metadata['titre de la convention'],
      nature,
      etat,
      idcc,
      updated: [],
      unknown: false,
    };

    return idccMetadatas;
  }, {} as { [idcc: string]: ICCWithMetadata });
}

const store = new DataStore<ICCWithMetadata>(
  routes.rechercheEntreprise.idcc.metadata,
  'idcc-metadata',
  mapToDomainObject
);

export const clientIdccMetadata = async (idcc: string) => {
  let res = await store.get(idcc);
  if (res === null) {
    res = {
      idKali: '',
      legifrance: '',
      title: '',
      nature: '',
      etat: '',
      idcc,
      updated: [],
      unknown: true,
    };
  }
  return res;
};
