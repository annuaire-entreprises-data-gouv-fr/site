import { clientApiEntrepriseChiffreAffaires } from '#clients/api-entreprise/chiffres-affaires';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { verifySiret } from '#utils/helpers';
import { handleApiEntrepriseError } from '../utils';

export type IChiffreAffairesProtected = {
  chiffreAffaires: number;
  dateFinExercice: string;
  year: number;
}[];

export const getChiffreAffairesProtected = async (
  maybeSiret: string
): Promise<IChiffreAffairesProtected | IAPINotRespondingError> => {
  const siret = verifySiret(maybeSiret);
  return clientApiEntrepriseChiffreAffaires(siret).catch((error) =>
    handleApiEntrepriseError(error, {
      siret,
      apiResource: 'ChiffreAffairesDGFiP',
    })
  );
};
