import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { hasAnyError, isDataSuccess } from '#models/data-fetching';
import { getDirigeantsRNE } from '#models/rne/dirigeants';
import { IDirigeantsWithMetadata } from '#models/rne/types';
import { verifySiren } from '#utils/helpers';
import { getMandatairesRCS } from './mandataires-rcs';
import { mergeDirigeants } from './utils';

export const getDirigeantsProtected = async (
  maybeSiren: string
): Promise<IDirigeantsWithMetadata | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);

  const [dirigeantsRCS, dirigeantsRNE] = await Promise.all([
    getMandatairesRCS(siren),
    getDirigeantsRNE(siren),
  ]);

  const dirigeantMerged = mergeDirigeants(
    isDataSuccess(dirigeantsRCS) ? dirigeantsRCS : [],
    isDataSuccess(dirigeantsRNE) ? dirigeantsRNE.data : []
  );

  if (hasAnyError(dirigeantsRCS) && hasAnyError(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 404);
  }

  return {
    data: dirigeantMerged,
    metadata: {
      isFallback: Boolean(
        isDataSuccess(dirigeantsRNE) && dirigeantsRNE.metadata.isFallback
      ),
    },
  };
};
