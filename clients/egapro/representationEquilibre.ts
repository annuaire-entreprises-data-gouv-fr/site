import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IEgaproRepresentation } from '#models/certifications/egapro-respresentation-equilibre';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import {
  IEgaproRepresentationResponse,
  IEgaproRepresentationItem,
} from './types';

export const clientEgaproRepresentationEquilibre = async (
  siren: Siren
): Promise<IEgaproRepresentation> => {
  const responseSearchApi = await httpGet(
    routes.egapro.representationEquilibree.api,
    {
      params: { q: siren },
    }
  );

  const dataSearch = responseSearchApi.data
    ?.data as IEgaproRepresentationResponse['data'];

  if (!dataSearch || !dataSearch?.length) {
    throw new HttpNotFound(
      `Cannot found egapro data associate to siren : ${siren}`
    );
  }
  return mapToDomainObject(dataSearch[0]);
};

const mapToDomainObject = (
  egapro: IEgaproRepresentationItem
): IEgaproRepresentation => {
  const { représentation_équilibrée } = egapro;

  const formatted: IEgaproRepresentation = {
    years: [],
    scores: {
      pourcentageFemmesCadres: [],
      pourcentageHommesCadres: [],
      pourcentageFemmesMembres: [],
      pourcentageHommesMembres: [],
    },
  };

  Object.keys(représentation_équilibrée).forEach((e, index) => {
    const value = représentation_équilibrée[e];
    formatted.years.push(e);
    formatted.scores.pourcentageFemmesCadres.push(
      value.pourcentage_femmes_cadres
    );
    formatted.scores.pourcentageHommesCadres.push(
      value.pourcentage_hommes_cadres
    );
    formatted.scores.pourcentageFemmesMembres.push(
      value.pourcentage_femmes_membres
    );
    formatted.scores.pourcentageHommesMembres.push(
      value.pourcentage_hommes_membres
    );
  });

  return formatted;
};
