import { Siren } from '#utils/helpers';

/** Administration that are not L100-3 but are still authorized to acces espace agent */
const authorizedAdministrationWhitelist = {
  '385290309': 'ADEME',
};

export const isNotL100_3ButWhitelisted = (siren: Siren) => {
  return Object.hasOwn(authorizedAdministrationWhitelist, siren);
};
