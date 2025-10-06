import routes from "#clients/routes";
import type { IConventionsCollectives } from "#models/conventions-collectives";
import type { Siren } from "#utils/helpers";
import { httpGet } from "#utils/network";

export const clientIdccRechercheEntreprise = async (
  siren: Siren
): Promise<IConventionsCollectives> => {
  const url = routes.rechercheEntreprise.idcc.getBySiren(siren);
  const data = await httpGet<IConventionsCollectives>(url, {});

  return data;
};
