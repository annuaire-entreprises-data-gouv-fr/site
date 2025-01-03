import routes from '#clients/routes';
import { IChiffreAffairesProtected } from '#models/espace-agent/chiffre-affaires';
import { Siret } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseDgfipChiffreAffaires } from './types';

/**
 * GET CA from API Entreprise
 */
export async function clientApiEntrepriseChiffreAffaires(siret: Siret) {
  return await clientAPIEntreprise<
    IAPIEntrepriseDgfipChiffreAffaires,
    IChiffreAffairesProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.dgfip.chiffreAffaires(siret)}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseDgfipChiffreAffaires
): IChiffreAffairesProtected => {
  return response.data.map(({ data }) => ({
    chiffreAffaires: data.chiffre_affaires,
    dateFinExercice: data.date_fin_exercice,
    year: getFiscalYear(data.date_fin_exercice),
  }));
};
