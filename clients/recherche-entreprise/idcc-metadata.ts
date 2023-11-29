import routes from '#clients/routes';
import { ICCWithMetadata } from '#models/conventions-collectives-list';
import { httpGet } from '#utils/network';

type IIdccMetadata = {
  [idcc: string]: {
    'titre de la convention': string; //Convention collective na… des cabinets d'avocats"
    id_kali: string; //KALICONT000005635185"
    cc_ti: string; //IDCC"
    nature: string; //CONVENTION COLLECTIVE NATIONALE"
    etat: string; //VIGUEUR_ETEN"
    debut: string; //1979-03-01 00:00:00"
    fin: string | null;
    url: string; //https://www.legifrance.g…/id/KALICONT000005635185"
  };
};

export const clientIdccMetadata = async () => {
  const response = await httpGet<IIdccMetadata>(
    routes.conventionsCollectives.metadata
  );

  return mapToDomainObject(response);
};

const mapToDomainObject = (response: IIdccMetadata) => {
  return Object.entries(response).reduce((idccMetadatas, [idcc, metadata]) => {
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
  }, {} as { [idcc: string]: ICCWithMetadata });
};
