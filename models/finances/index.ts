import { HttpNotFound } from '#clients/exceptions';
import {
  clientFinance,
  IFinance,
} from '#clients/open-data-soft/donnees-financieres';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IFinancesFromSlug {
  uniteLegale: IUniteLegale;
  finances: IFinance[] | IAPINotRespondingError;
}

export const getFinancesFromSlug = async (
  slug: string
): Promise<IFinancesFromSlug> => {
  const siren = verifySiren(slug);
  const [uniteLegale, finances] = await Promise.all([
    getUniteLegaleFromSlug(siren),
    clientFinance(siren).catch((e) => {
      if (e instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.MEF, 404);
      }
      logErrorInSentry('Error in API data financieres', {
        siren,
        details: e.toString(),
      });
      return APINotRespondingFactory(EAdministration.MEF, e.status || 500);
    }),
  ]);
  return {
    uniteLegale,
    finances,
  };
};
