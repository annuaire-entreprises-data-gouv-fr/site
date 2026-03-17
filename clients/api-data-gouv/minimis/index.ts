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
import type { IMinimis, IMinimisDatagouvResponse } from "./interface";

export const clientMinimis = async (
  siren: string,
  page = 1
): Promise<IMinimis | IAPINotRespondingError> => {
  try {
    const response = await httpGet<IMinimisDatagouvResponse>(
      `${routes.datagouv.minimis}?identifiant_beneficiaire__contains=${siren}&page=${page}&page_size=20`,
      {
        timeout: constants.timeout.S,
      }
    );

    if (response.data.length === 0) {
      throw new HttpNotFound(`No Minimis record found for siren ${siren}`);
    }

    return mapToDomainObject(response);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Minimis",
        context: {
          siren,
        },
        administration: EAdministration.DINUM,
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};

const mapToDomainObject = (response: IMinimisDatagouvResponse): IMinimis => ({
  aides: response.data.map((item) => ({
    autorite: item.autorite,
    dateOctroi: item.date_octroi,
    instrumentAide: item.instrument_aide,
    montant: item.montant_esb,
    operateur: item.operateur,
    regime: item.regime,
    secteurAide: item.secteur_aide,
  })),
  meta: response.meta,
});
