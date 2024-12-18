import routes from '#clients/routes';
import { IBanqueDeFranceBilansProtected } from '#models/espace-agent/banque-de-france/bilans';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseBanqueDeFranceBilans } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseBanqueDeFranceBilans(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseBanqueDeFranceBilans,
    IBanqueDeFranceBilansProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.banqueDeFranceBilans(siren)}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseBanqueDeFranceBilans
): IBanqueDeFranceBilansProtected => {
  return response;
};
