/**
 * When a company removes a commercial name,
 * INSEE sets its old "denomination usuelle" to "SUPPRESSION DU NOM COMMERCIAL".
 * This function removes that specific mention.
 */
export const formatDenominationUsuelle = (denominationUsuelle: string) => {
  return denominationUsuelle !== 'SUPPRESSION DU NOM COMMERCIAL'
    ? denominationUsuelle
    : '';
};
