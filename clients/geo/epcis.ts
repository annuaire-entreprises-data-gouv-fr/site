import routes from "#clients/routes";
import constants from "#models/constants";
import { httpGet } from "#utils/network";
import type { IGeoElement } from ".";

type IGeoEpciResponse = {
  nom: string;
  code: string;
};

export const clientEpcisBySiren = async (
  siren: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoEpciResponse[]>(
    `${routes.geo.epcis}?fields=nom,code&code=${siren}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

export const clientEpcisByName = async (
  term: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoEpciResponse[]>(
    `${routes.geo.epcis}?fields=nom,code&nom=${term}`,
    {
      timeout: constants.timeout.L,
    }
  );

  return mapToDomainObject(response || []);
};

const mapToDomainObject = (response: IGeoEpciResponse[]): IGeoElement[] =>
  response.map((epci) => ({
    label: `${epci.nom} (EPCI)`,
    value: epci.code,
    type: "epci",
  }));
