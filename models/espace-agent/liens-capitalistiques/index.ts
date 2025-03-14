import { clientApiEntrepriseLiensCapitalistiques } from '#clients/api-entreprise/liens-capitalistiques';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  IEtatCivilLiensCapitalistiques,
  IPersonneMoraleLiensCapitalistiques,
} from '#models/rne/types';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type ILiensCapitalistiquesProtected = Array<
  IPersonneMoraleLiensCapitalistiques | IEtatCivilLiensCapitalistiques
>;

export const getLiensCapitalistiquesProtected = async (
  maybeSiren: string,
  year: string | number
): Promise<ILiensCapitalistiquesProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseLiensCapitalistiques(siren, year).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'LiensCapitalistiquesProtected',
    })
  );
};
