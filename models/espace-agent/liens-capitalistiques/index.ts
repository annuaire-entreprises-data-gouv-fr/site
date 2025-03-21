import { clientApiEntrepriseLiensCapitalistiques } from '#clients/api-entreprise/liens-capitalistiques';
import { IAPINotRespondingError } from '#models/api-not-responding';
import {
  IEtatCivilLiensCapitalistiques,
  IPersonneMoraleLiensCapitalistiques,
} from '#models/rne/types';
import { UseCase } from '#models/use-cases';
import { verifySiren } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type ILiensCapitalistiquesProtected = Array<
  IPersonneMoraleLiensCapitalistiques | IEtatCivilLiensCapitalistiques
>;

export const getLiensCapitalistiquesProtected = async (
  maybeSiren: string,
  params: { year?: string; useCase?: UseCase }
): Promise<ILiensCapitalistiquesProtected | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);
  return clientApiEntrepriseLiensCapitalistiques(
    siren,
    params.year,
    params.useCase
  ).catch((error) =>
    handleApiEntrepriseError(error, {
      siren,
      apiResource: 'LiensCapitalistiquesProtected',
    })
  );
};
