import routes from "#clients/routes";
import constants from "#models/constants";
import type { IFiness, IFinessEtablissement } from "#models/finess/type";
import { formatAdresse } from "#utils/helpers";
import { httpGet } from "#utils/network";

export const clientFiness = async (
  nofinessejList: string[]
): Promise<IFiness[]> => {
  const [finessJuridiqueEntities, finessGeoEntities] = await Promise.all([
    httpGet<IFinessJuridiqueDatagouvResponse>(
      `${routes.datagouv.finessJuridique}?nofiness__in=${nofinessejList.join(",")}&page_size=100`,
      {
        timeout: constants.timeout.L,
      }
    ),
    await httpGet<IFinessGeoDatagouvResponse>(
      `${routes.datagouv.finessGeo}?nofinessej__in=${nofinessejList.join(",")}&page_size=100`,
      {
        timeout: constants.timeout.L,
      }
    ),
  ]);

  return finessJuridiqueEntities.data
    .map(mapJuridiqueToDomainObject)
    .map((juridiqueEntity) => {
      juridiqueEntity.finessEtablissements = finessGeoEntities.data
        .filter((geo) => geo.nofinessej === juridiqueEntity.idFinessJuridique)
        .map(mapGeoToDomainObject);

      return juridiqueEntity;
    });
};

const mapJuridiqueToDomainObject = (
  response: IFinessJuridiqueItem
): IFiness => ({
  idFinessJuridique: response["nofiness"] || "",
  raisonSociale: response["rslongue"] || response["rs"] || "",
  siren: response["siren"] || "",
  finessEtablissements: [],
});

const mapGeoToDomainObject = (
  response: IFinessGeoItem
): IFinessEtablissement => ({
  idFinessGeo: response["nofinesset"] || "",
  raisonSociale: response["rslongue"] || response["rs"] || "",
  siret: response["siret"] || "",
  phone: response["telephone"] || "",
  category: response["libcategetab"] || "",
  MFT: response["libmft"] || "",
  SPH: response["libsph"] || "",
  adresse: formatAdresse({
    numeroVoie: response["numvoie"],
    typeVoie: response["typvoie"],
    libelleVoie: response["voie"],
    libelleCommuneCedex: response["ligneacheminement"],
  }),
});
