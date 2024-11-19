import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '#models/api-not-responding';
import { InternalError } from '#models/exceptions';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import { IDirigeantsWithMetadataAfterInpiIgMerge } from '#models/rne/types';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { getMandatairesRCS } from './mandataires-rcs';
import { mergeDirigeants } from './utils';

export const getDirigeantsProtected = async (
  maybeSiren: string
): Promise<
  IDirigeantsWithMetadataAfterInpiIgMerge | IAPINotRespondingError
> => {
  const siren = verifySiren(maybeSiren);

  const [dirigeantsRCS, dirigeantsRNE] = await Promise.all([
    getMandatairesRCS(siren),
    getDirigeantsRNE(siren),
  ]);

  if (isAPI404(dirigeantsRCS) && isAPI404(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 404);
  }

  if (isAPINotResponding(dirigeantsRCS) && isAPINotResponding(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }

  try {
    const dirigeantMerged = mergeDirigeants(
      !isAPINotResponding(dirigeantsRCS) ? dirigeantsRCS : [],
      !isAPINotResponding(dirigeantsRNE) ? dirigeantsRNE.data : []
    );

    return {
      data: dirigeantMerged,
      metadata: {
        isFallback: Boolean(
          !isAPINotResponding(dirigeantsRNE) &&
            dirigeantsRNE.metadata.isFallback
        ),
      },
    };
  } catch (e: any) {
    logErrorInSentry(
      new InternalError({
        message: 'mergeDirigeants',
        cause: e,
        context: {
          details: siren,
        },
      })
    );
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};
