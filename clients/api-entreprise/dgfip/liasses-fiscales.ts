import routes from '#clients/routes';
import { ILiassesFiscalesProtected } from '#models/espace-agent/dgfip/liasses-fiscales';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseLiassesFiscales } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseDgfipLiassesFiscales(
  siren: Siren,
  year: number
) {
  return await clientAPIEntreprise<
    IAPIEntrepriseLiassesFiscales,
    ILiassesFiscalesProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.dgfip.liassesFiscales(siren, year)}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseLiassesFiscales
): ILiassesFiscalesProtected => {
  return response.data.declarations.map((declaration) => ({
    dureeExercice: declaration.duree_exercice,
    dateFinExercice: declaration.date_fin_exercice,
    donnees: declaration.donnees.map((donnee) => ({
      intitule: donnee.intitule,
      valeurs: donnee.valeurs,
    })),
  }));
};
