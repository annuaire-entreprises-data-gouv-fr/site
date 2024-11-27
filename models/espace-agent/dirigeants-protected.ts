import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '#models/api-not-responding';
import { InternalError } from '#models/exceptions';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import {
  IDirigeantsMergedIGInpi,
  IDirigeantsWithMetadataMergedIGInpi,
} from '#models/rne/types';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { getMandatairesRCS } from './mandataires-rcs';
import { mergeDirigeants } from './utils';

export const getDirigeantsProtected = async (
  maybeSiren: string,
  params: { isEI: boolean }
): Promise<IDirigeantsWithMetadataMergedIGInpi | IAPINotRespondingError> => {
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

  // EI can either be in RCS or not, we dont know in advance.
  const rcsNotRelevant =
    params.isEI &&
    (isAPINotResponding(dirigeantsRCS) || dirigeantsRCS.length === 0);

  try {
    const rneData = !isAPINotResponding(dirigeantsRNE)
      ? dirigeantsRNE.data
      : [];
    const rcsData = !isAPINotResponding(dirigeantsRCS) ? dirigeantsRCS : [];

    let dirigeantMerged: IDirigeantsMergedIGInpi = [];
    if (params.isEI) {
      if (rcsData.length === 0) {
        // Ignore IG
        dirigeantMerged = mergeDirigeants(rneData, rneData);
      } else {
        // Ignore INPI
        dirigeantMerged = mergeDirigeants(rcsData, rcsData);
      }
    } else {
      dirigeantMerged = mergeDirigeants(rneData, rcsData);
    }

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
