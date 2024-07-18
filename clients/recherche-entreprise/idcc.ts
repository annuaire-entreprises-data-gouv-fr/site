import routes from '#clients/routes';
import { IConventionsCollectives } from '#models/conventions-collectives';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';

export const clientIdccRechercheEntreprise = async (
  siren: Siren,
  useCache = false
): Promise<IConventionsCollectives> => {
  const url = `${routes.rechercheEntreprise.idcc.siren}/${siren}`;
  const data = await httpGet<IConventionsCollectives>(url, {
    useCache,
  });

  return data;
};
