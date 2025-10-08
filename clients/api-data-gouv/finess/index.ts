import { HttpNotFound } from "#clients/exceptions";
import routes from "#clients/routes";
import constants from "#models/constants";
import type { IFiness } from "#models/finess/type";
import { formatAdresse, type Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";

export const clientFiness = async (
  siren: Siren
): Promise<{ [idFiness: string]: IFiness[] }> => {
  const response = await httpGet<IFinessDatagouvResponse>(
    `${routes.datagouv.finess}?Siret__contains=${siren}&page_size=100`,
    {
      timeout: constants.timeout.L,
    }
  );

  if (response.data.length === 0) {
    throw new HttpNotFound(`No Finess record found for siren ${siren}`);
  }

  const finessList = response.data.map(mapToDomainObject);

  return finessList.reduce(
    (aggregate: { [idFiness: string]: IFiness[] }, current: IFiness) => {
      const previous = aggregate[current.idFiness] || [];
      aggregate[current.idFiness] = [...previous, current];
      return aggregate;
    },
    {}
  );
};

const mapToDomainObject = (response: IFinessItem) => ({
  idFiness: response["nofinessej"] || "",
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
