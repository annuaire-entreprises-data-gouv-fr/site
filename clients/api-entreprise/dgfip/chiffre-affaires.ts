import routes from '#clients/routes';
import { IDgfipChiffreAffairesProtected } from '#models/espace-agent/dgfip/chiffre-affaires';
import { Siret } from '#utils/helpers';
import { getFiscalYear } from '#utils/helpers/formatting/format-fiscal-year';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseDgfipChiffreAffaires } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseDgfipChiffreAffaires(siret: Siret) {
  return await clientAPIEntreprise<
    IAPIEntrepriseDgfipChiffreAffaires,
    IDgfipChiffreAffairesProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.dgfip.chiffreAffaires(siret)}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseDgfipChiffreAffaires
): IDgfipChiffreAffairesProtected => {
  return response.data.map(({ data }) => ({
    chiffreAffaires: data.chiffre_affaires,
    year: getFiscalYear(data.date_fin_exercice),
  }));
};
