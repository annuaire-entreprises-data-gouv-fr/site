import { clientApiDataSubvention } from '#clients/api-data-subvention';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/core/unite-legale';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';

export type ISubventions = ISubvention[];

export interface ISubvention {
  year: number;
  label: string;
  status: string;
  description: string;
  amount: number | undefined;
}

export const getSubventionsAssociationFromSlug = async (
  slug: string
): Promise<ISubventions | IAPINotRespondingError> => {
  const uniteLegale = await getUniteLegaleFromSlug(slug, {
    isBot: false,
  });

  const { siren } = uniteLegale;

  try {
    return await clientApiDataSubvention(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DJEPVA, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        ressource: 'DataSubvention',
        cause: e,
        context: {
          siren,
        },
        administration: EAdministration.DJEPVA,
      })
    );
    return APINotRespondingFactory(EAdministration.DJEPVA, 500);
  }
};
