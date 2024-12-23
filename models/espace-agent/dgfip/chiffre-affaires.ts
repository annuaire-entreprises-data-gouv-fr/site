import { clientApiEntrepriseDgfipChiffreAffaires } from '#clients/api-entreprise/dgfip/chiffre-affaires';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type IDgfipChiffreAffairesProtected = {
  chiffreAffaires: number;
  year: number;
}[];

export const getDgfipChiffreAffairesProtected = async (
  maybeSiret: string
): Promise<IDgfipChiffreAffairesProtected | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseDgfipChiffreAffaires(siret).catch((error) =>
    handleApiEntrepriseError(error, {
      siret,
      apiResource: 'getDgfipChiffreAffairesProtected',
    })
  );
};
