import { clientApiEntrepriseDgfipChiffreAffaires } from '#clients/api-entreprise/dgfip/chiffre-affaires';
import { IAPIEntrepriseDgfipChiffreAffaires } from '#clients/api-entreprise/dgfip/types';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

// TEMP
export type IDgfipChiffreAffairesProtected = IAPIEntrepriseDgfipChiffreAffaires;

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
