import { clientAPIInclusion } from '#clients/api-inclusion';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export type IEntrepriseInclusive = {
  marcheInclusionLink: string;
};

export const getEntrepriseInclusive = async (
  uniteLegale: IUniteLegale
): Promise<IEntrepriseInclusive | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estEntrepriseInclusive) {
      throw new HttpNotFound('Not an entreprise inclusive');
    }
    return await clientAPIInclusion();
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.DINUM, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'EntrepriseInclusive',
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.DINUM,
      })
    );
    return APINotRespondingFactory(EAdministration.DINUM, 500);
  }
};
