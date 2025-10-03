import routes from "#clients/routes";
import constants from "#models/constants";
import { httpGet } from "#utils/network";
import type { IGeoElement } from ".";

type IGeoDepartementResponse = {
  nom: string;
  code: string;
};

export const clientDepartementsByName = async (
  slug: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoDepartementResponse[]>(
    `${routes.geo.departements}?fields=code&format=json&zone=metro,drom,com&nom=${slug}`,
    {
      timeout: constants.timeout.L,
    }
  );
  return mapToDomainObject(response || []);
};

export const clientDepartementByCode = async (
  code: string
): Promise<IGeoElement[]> => {
  const response = await httpGet<IGeoDepartementResponse[]>(
    `${routes.geo.departements}?fields=code&format=json&zone=metro,drom,com&code=${code}`,
    {
      timeout: constants.timeout.L,
    }
  );
  return mapToDomainObject(response || []);
};

const mapToDomainObject = (
  response: IGeoDepartementResponse[]
): IGeoElement[] => {
  return response.map((departement) => {
    return {
      label: `${departement.nom} (${departement.code})`,
      value: departement.code,
      type: "dep",
    };
  });
};
