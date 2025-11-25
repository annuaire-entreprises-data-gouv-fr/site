import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import { EAdministration } from "#models/administrations/EAdministration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#models/api-not-responding";
import constants from "#models/constants";
import type { IUniteLegale } from "#models/core/types";
import { FetchRessourceException } from "#models/exceptions";
import { httpGet } from "#utils/network";
import logErrorInSentry from "#utils/sentry";
import type {
  IEntrepreneursSpectacles,
  IEntrepreneursSpectaclesDatagouvResponse,
} from "./interface";

export const clientEntrepreneursSpectacles = async (
  uniteLegale: Pick<IUniteLegale, "siren" | "complements">,
  page = 1
): Promise<IEntrepreneursSpectacles | IAPINotRespondingError> => {
  const siren = uniteLegale.siren;

  try {
    if (!uniteLegale.complements.estEntrepreneurSpectacle) {
      throw new HttpNotFound("Not entrepreneur spectacle");
    }

    const response = await httpGet<IEntrepreneursSpectaclesDatagouvResponse>(
      `${routes.datagouv.entrepreneursSpectacles}?siren_siret__sort=asc&siren_siret__contains=${siren}&page=${page}&page_size=20`,
      {
        timeout: constants.timeout.S,
      }
    );

    if (response.data.length === 0) {
      throw new HttpNotFound(
        `No Spectacles Vivants record found for siren ${siren}`
      );
    }

    return mapToDomainObject(response);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }

    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "EntrepreneurSpectacles",
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.DINUM,
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};

const mapToDomainObject = (
  response: IEntrepreneursSpectaclesDatagouvResponse
): IEntrepreneursSpectacles => ({
  licences: response.data.map((item) => ({
    categorie: item.categorie.toString(),
    numeroRecepisse: item.numero_recepisse,
    statut: item.statut_recepisse,
    dateValidite: item.date_validite,
    dateDepot: item.date_depot_dossier,
    type: item.type_declaration,
    nomLieu: item.nom_lieu,
  })),
  meta: response.meta,
});
