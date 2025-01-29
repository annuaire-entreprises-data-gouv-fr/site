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
    getDirigeantsRNE(siren, { isBot: false }),
  ]);

  if (isAPI404(dirigeantsRCS) && isAPI404(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 404);
  }

  if (isAPINotResponding(dirigeantsRCS) && isAPINotResponding(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }

  try {
    const rneData = !isAPINotResponding(dirigeantsRNE)
      ? dirigeantsRNE.data
      : [];
    const rcsData = !isAPINotResponding(dirigeantsRCS) ? dirigeantsRCS : [];

    // EI data is not standardised. It lacks birthdate in RNE and is randomly populated in IG
    let dirigeantMerged: IDirigeantsMergedIGInpi = [];
    if (params.isEI) {
      if (rcsData.length === 0) {
        // Ignore IG
        dirigeantMerged = mergeDirigeants({ rne: rneData, rcs: rneData });
      } else {
        // Ignore INPI
        dirigeantMerged = mergeDirigeants({ rne: rcsData, rcs: rcsData });
      }
    } else {
      dirigeantMerged = mergeDirigeants({ rne: rneData, rcs: rcsData });
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
