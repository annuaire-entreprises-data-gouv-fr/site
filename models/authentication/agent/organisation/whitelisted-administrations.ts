import type { Siren } from "#utils/helpers";

/** Administration that are not L100-3 but are still authorized to acces espace agent */
const authorizedAdministrationWhitelist = {
  "385290309": "ADEME",
  "180020026": "CAISSE DES DEPOTS ET CONSIGNATIONS",
  "334654035": "MAISONS & CITES SOCIETE ANONYME D`HLM",
  "662043116": "OFFICE NATIONAL DES FORETS (ONF)",
  "843721416": "CHARTRES METROPOLE TRAITEMENT ET VALORISATION",
};

export const isOrganisationWhitelisted = (siren: Siren) => {
  return Object.hasOwn(authorizedAdministrationWhitelist, siren);
};
