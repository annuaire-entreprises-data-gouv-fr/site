import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import type { Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";
import type {
  IEntrepreneursSpectacles,
  IEntrepreneursSpectaclesDatagouvResponse,
} from "./interface";

export const clientEntrepreneursSpectacles = async (
  siren: Siren,
  page = 1
): Promise<IEntrepreneursSpectacles> => {
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
