import { Siren } from '#utils/helpers';

const organisationWhitelist: Siren[] = [];

/**
 * These organisation do not belong to the official administration list but they can still access espace agent
 * @param siret
 * @param idpId
 * @returns
 */
export const isOrganisationWhitelisted = (siren: Siren) => {
  return organisationWhitelist.indexOf(siren) > -1;
};
