import { IEtatCivil, IPersonneMorale } from '#models/rne/types';

/**
 * Weird bug happennig here. Webpack build fail when this function is in model/dirigeants.ts
 * @param toBeDetermined
 * @returns
 */
export const isPersonneMorale = (
  toBeDetermined: IEtatCivil | IPersonneMorale
): toBeDetermined is IPersonneMorale => {
  return 'siren' in toBeDetermined || 'denomination' in toBeDetermined;
};
