import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#models/api-not-responding";
import constants from "#models/constants";
import { FetchRessourceException } from "#models/exceptions";
import { httpGet } from "#utils/network";
import logErrorInSentry from "#utils/sentry";
import type { IAvocats, IAvocatsDatagouvResponse } from "./interface";

export const clientAvocats = async (
  siren: string,
  page = 1
): Promise<IAvocats | IAPINotRespondingError> => {
  try {
    const response = await httpGet<IAvocatsDatagouvResponse>(
      `${routes.datagouv.avocats}?cbSiretSiren__exact=${siren}&page=${page}&page_size=5`,
      {
        timeout: constants.timeout.S,
      }
    );

    if (response.data.length === 0) {
      throw new HttpNotFound(`No Avocats record found for siren ${siren}`);
    }

    return mapToDomainObject(response);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Avocats",
        context: {
          siren,
        },
        administration: EAdministration.DINUM,
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};

const mapToDomainObject = (response: IAvocatsDatagouvResponse): IAvocats => ({
  avocats: response.data.map((item) => ({
    nom: item.avNom,
    prenom: item.avPrenom,
    nomBarreau: item.NomBarreau,
  })),
  meta: response.meta,
});
