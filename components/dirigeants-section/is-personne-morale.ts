import { IEtatCivil, IPersonneMorale } from '#models/immatriculation';

/**
 * Weird bug happennig here. Webpack build fail when this function is in model/dirigeants.ts
 * @param toBeDetermined
 * @returns
 */
export const isPersonneMorale = (
  toBeDetermined: IEtatCivil | IPersonneMorale
): toBeDetermined is IPersonneMorale => {
  if (
    (toBeDetermined as IPersonneMorale).siren ||
    (toBeDetermined as IPersonneMorale).denomination
  ) {
    return true;
  }
  return false;
};
