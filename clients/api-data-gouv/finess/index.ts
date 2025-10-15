import routes from "#clients/routes";
import constants from "#models/constants";
import type { IFiness } from "#models/finess/type";
import { formatAdresse } from "#utils/helpers";
import { httpGet } from "#utils/network";

export const clientFiness = async (
  nofinessejList: string[]
): Promise<IFiness[]> => {
  const [finessJuridique, finessGeo] = await Promise.all([
    httpGet<IFinessJuridiqueDatagouvResponse>(
      `${routes.datagouv.finess}?nofinessej__in=${nofinessejList.join(",")}&page_size=100`,
      {
        timeout: constants.timeout.L,
      }
    ),
    httpGet<IFinessGeoDatagouvResponse>(
      `${routes.datagouv.finess}?nofinessej__in=${nofinessejList.join(",")}&page_size=100`,
      {
        timeout: constants.timeout.L,
      }
    ),
  ]);

  return finessJuridique.data
    .map(mapJuridiqueToDomainObject)
    .map((juridiqueEntity) => {
      juridiqueEntity.geoFiness = finessGeo.data
        .filter((geo) => geo.nofinessej === juridiqueEntity.nofinessej)
        .map(mapGeoToDomainObject);

      return juridiqueEntity;
    });
};

const mapJuridiqueToDomainObject = (response: IFinessJuridiqueItem) => ({
  nofinessej: response["nofinessej"] || "",
  raisonSociale:
    response["RaisonSocialeLongue"] || response["RaisonSociale"] || "",
  siret: response["Siret"] || "",
  phone: response["Telephone"] || "",
  category: response["LibelleCategorie"] || "",
  MFT: response["LibelleMft"] || "",
  SPH: response["LibelleSph"] || "",
  adresse: formatAdresse({
    numeroVoie: response["NumeroVoie"],
    typeVoie: response["TypeVoie"],
    libelleVoie: response["LibelleVoie"],
    libelleCommuneCedex: response["LigneAcheminement"],
  }),
  geoFiness: [],
});

const mapGeoToDomainObject = (response: IFinessGeoItem) => ({
  nofinessej: response["nofinessej"] || "",
  nofinesset: response["nofinesset"] || "",
  raisonSociale:
    response["RaisonSocialeLongue"] || response["RaisonSociale"] || "",
  siret: response["Siret"] || "",
  phone: response["Telephone"] || "",
  category: response["LibelleCategorie"] || "",
  MFT: response["LibelleMft"] || "",
  SPH: response["LibelleSph"] || "",
  adresse: formatAdresse({
    numeroVoie: response["NumeroVoie"],
    typeVoie: response["TypeVoie"],
    libelleVoie: response["LibelleVoie"],
    libelleCommuneCedex: response["LigneAcheminement"],
  }),
});
