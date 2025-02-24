import { Siren } from '#utils/helpers';

/** Administration that are not L100-3 but are still authorized to acces espace agent */
const authorizedAdministrationWhitelist = {
  '385290309': 'ADEME',
};

export const isOrganisationWhitelisted = (siren: Siren) => {
  return Object.hasOwn(authorizedAdministrationWhitelist, siren);
};
