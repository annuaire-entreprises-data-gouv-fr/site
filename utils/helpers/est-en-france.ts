import type { IEtablissement } from "#models/core/types";

/**
 * Check if the etablissement is in France
 * @param etablissement
 * @returns true if the etablissement is in France, false otherwise
 */
export const estEnFrance = (etablissement: IEtablissement) =>
  !!etablissement.commune;
