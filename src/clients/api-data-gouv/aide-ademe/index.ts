import { HttpNotFound } from "#/clients/exceptions";
import routes from "#/clients/routes";
import { EAdministration } from "#/models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import constants from "#/models/constants";
import { FetchRessourceException } from "#/models/exceptions";
import { httpGet } from "#/utils/network";
import logErrorInSentry from "#/utils/sentry";
import type { IAidesADEME, IAidesADEMEDatagouvResponse } from "./interface";

export const clientAidesADEME = async (
  siren: string,
  page = 1
): Promise<IAidesADEME | IAPINotRespondingError> => {
  try {
    const response = await httpGet<IAidesADEMEDatagouvResponse>(
      `${routes.datagouv.aidesAdeme}?idBeneficiaire__contains=${siren}&page=${page}&page_size=20`,
      {
        timeout: constants.timeout.S,
      }
    );

    if (response.data.length === 0) {
      throw new HttpNotFound(`No Aides ADEME record found for siren ${siren}`);
    }

    return mapToDomainObject(response);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Aides ADEME",
        context: {
          siren,
        },
        administration: EAdministration.DINUM,
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};

const mapToDomainObject = (
  response: IAidesADEMEDatagouvResponse
): IAidesADEME => ({
  aides: response.data.map((item) => ({
    conditionsVersement: item.conditionsVersement,
    dateConvention: item.dateConvention,
    datesPeriodeVersement: item.datesPeriodeVersement,
    dispositifAide: item.dispositifAide,
    idBeneficiaire: item.idBeneficiaire,
    montant: item.montant,
    nature: item.nature,
    nomAttribuant: item["Nom de l attribuant"],
    nomBeneficiaire: item.nomBeneficiaire,
    objet: item.objet,
    referenceDecision: item.referenceDecision,
  })),
  meta: response.meta,
});
