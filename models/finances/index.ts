import { clientFinance, IFinance } from '#clients/finance';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { IUniteLegale } from '..';

export interface IFinancesFromSlug {
  uniteLegale: IUniteLegale;
  finances: IFinance[];
}

export const getFinancesFromSlug = async (
  slug: string
): Promise<IFinancesFromSlug> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug);
  const finances = await clientFinance(uniteLegale.siren);
  return {
    uniteLegale,
    finances,
  };
};
