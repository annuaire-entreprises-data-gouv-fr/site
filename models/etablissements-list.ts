import constants from '#models/constants';
import { IEtablissement } from '.';
import { estActif } from './etat-administratif';
import { estDiffusible } from './statut-diffusion';

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
 * @param realTotal (optional) total etablissement (can exceed pagination)
 * @returns
 */
export const createEtablissementsList = (
  all: IEtablissement[],
  currentEtablissementPage = 0,
  realTotal?: number
) => {
  const open = all
    .filter((e) => estActif(e) && estDiffusible(e))
    .sort((a) => (a.estSiege ? -1 : 1));

  const closed = all.filter((e) => !estActif(e) && estDiffusible(e));

  const unknown = all.filter((e) => !estDiffusible(e));

  // real total can exceede all.length if we need pagination
  const nombreEtablissements = realTotal || all.length;
  const usePagination =
    nombreEtablissements > constants.resultsPerPage.etablissements;

  return {
    all,
    open,
    unknown,
    closed,
    nombreEtablissementsOuverts: open.length,
    nombreEtablissements: nombreEtablissements,
    // pagination
    usePagination,
    currentEtablissementPage,
  };
};
