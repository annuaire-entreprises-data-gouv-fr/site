import constants from '#models/constants';
import { estNonDiffusibleStrict } from './diffusion';
import { estActif } from './etat-administratif';
import { IEtablissement } from './types';

export interface IEtablissementsList {
  etablissements: IEtablissement[];
  nombreEtablissements: number;
  nombreEtablissementsOuverts: number;
  currentEtablissementPage: number;
  usePagination: boolean;
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
  realTotal?: number,
  realOpen?: number
) => {
  const open = getOpenEtablissementsList(all);
  // real total and open can exceede all.length if we need pagination
  const nombreEtablissements = realTotal ?? all.length;
  const nombreEtablissementsOuverts = realOpen ?? open.length;

  const usePagination =
    nombreEtablissements > constants.resultsPerPage.etablissements;

  return {
    etablissements: all,
    nombreEtablissements,
    nombreEtablissementsOuverts,
    // pagination
    usePagination,
  };
};

export const getOpenEtablissementsList = (all: IEtablissement[]) =>
  all.filter((e) => estActif(e) && !estNonDiffusibleStrict(e));
