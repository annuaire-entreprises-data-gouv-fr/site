import { clientMarcheInclusion } from '#clients/api-inclusion';
import { clientInclusionKindMetadata } from '#clients/api-inclusion/inclusion-kind';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '../core/types';

export type IEntrepriseInclusive = {
  marcheInclusionLink: string;
  type: string;
  category: string;
  siret: string;
  city: string;
  department: string;
};

export const getEntrepriseInclusive = async (
  uniteLegale: IUniteLegale
): Promise<IEntrepriseInclusive[] | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estEntrepriseInclusive) {
      throw new HttpNotFound('Not an entreprise inclusive');
    }
    const entrepriseInclusiveList = await clientMarcheInclusion(
      uniteLegale.siren
    );
    return await Promise.all(
      entrepriseInclusiveList.map(async ({ kind, ...rest }) => {
        const kindLabel = await clientInclusionKindMetadata(kind);
        return {
          ...rest,
          category: kindLabel?.parent || '',
          type: kindLabel?.name ? `${kindLabel?.name} (${kind})` : kind,
        };
      })
    );
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MARCHE_INCLUSION, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'EntrepriseInclusive',
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.MARCHE_INCLUSION,
      })
    );
    return APINotRespondingFactory(
      EAdministration.MARCHE_INCLUSION,
      e.status || 500
    );
  }
};
