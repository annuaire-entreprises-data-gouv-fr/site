import constants from '#models/constants';
import { estNonDiffusible } from './diffusion';
import { estActif } from './etat-administratif';
import { IEtablissement } from './types';

export interface IEtablissementsList {
  etablissements: {
    all: IEtablissement[];
    open: IEtablissement[];
    closed: IEtablissement[];
    unknown: IEtablissement[];
    nombreEtablissements: number;
    nombreEtablissementsOuverts: number;
    // pagination
    currentEtablissementPage: number;
    usePagination: boolean;
  };
}

/**
 * Split a list of etablissements by status (open/closed)
 *
 * @param all
 * @param currentEtablissementPage (optional) for pagination
 * @param realTotal (optional) total etablissements if known, otherwise fallback on etablissement list within pagination
 * @param realOpen (optional) total open etablissements if known, otherwise fallback on etablissement list within pagination
 * @returns
 */
export const createEtablissementsList = (
  all: IEtablissement[],
  currentEtablissementPage = 0,
  realTotal?: number,
  realOpen?: number
) => {
  const open = all
    .filter((e) => estActif(e) && !estNonDiffusible(e))
    .sort((a) => (a.estSiege ? -1 : 1));

  const closed = all.filter((e) => !estActif(e) && !estNonDiffusible(e));

  const unknown = all.filter((e) => estNonDiffusible(e));

  // real total and open can exceede all.length if we need pagination
  const nombreEtablissements = realTotal ?? all.length;
  const nombreEtablissementsOuverts = realOpen ?? open.length;

  const usePagination =
    nombreEtablissements > constants.resultsPerPage.etablissements;

  return {
    all,
    open,
    unknown,
    closed,
    nombreEtablissementsOuverts,
    nombreEtablissements,
    // pagination
    usePagination,
    currentEtablissementPage,
  };
};
