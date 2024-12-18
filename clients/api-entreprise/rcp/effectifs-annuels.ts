import routes from '#clients/routes';
import { IRcpEffectifsAnnuelsProtected } from '#models/espace-agent/rcp/effectifs-annuels';
import { Siren } from '#utils/helpers';
import clientAPIEntreprise from '../client';
import { IAPIEntrepriseRcpEffectifsAnnuels } from './types';

/**
 * GET association from API Entreprise
 */
export async function clientApiEntrepriseRcpEffectifsAnnuels(siren: Siren) {
  return await clientAPIEntreprise<
    IAPIEntrepriseRcpEffectifsAnnuels,
    IRcpEffectifsAnnuelsProtected
  >(
    `${
      process.env.API_ENTREPRISE_URL
    }${routes.apiEntreprise.rcp.effectifsAnnuels(
      siren,
      // TEMP
      2022
    )}`,
    mapToDomainObject
  );
}

const mapToDomainObject = (
  response: IAPIEntrepriseRcpEffectifsAnnuels
): IRcpEffectifsAnnuelsProtected => {
  return response;
};
