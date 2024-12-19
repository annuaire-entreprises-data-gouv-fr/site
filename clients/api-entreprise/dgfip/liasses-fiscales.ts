import routes from '#clients/routes';
import { IDgfipLiassesFiscalesProtected } from '#models/espace-agent/dgfip/liasses-fiscales';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseDgfipLiassesFiscales } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseDgfipLiassesFiscales(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseDgfipLiassesFiscales,
    IDgfipLiassesFiscalesProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.dgfip.liassesFiscales(
      siren,
      //TEMP
      2022
    )}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseDgfipLiassesFiscales
): IDgfipLiassesFiscalesProtected => {
  return response;
};
