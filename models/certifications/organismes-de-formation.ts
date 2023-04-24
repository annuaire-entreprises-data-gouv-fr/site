import { HttpNotFound } from '#clients/exceptions';
import {
  IOrganismeFormation,
  clientOrganismeFormation,
} from '#clients/open-data-soft/qualiopi';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export type IOrganismeFormation = {
  records: {
    nda: string | null;
    siret: string | null;
    stagiaires: number | null;
    certifications: string[];
  }[];
  lastModified: string | null;
};

export const getOrganismesDeFormation = async (
  uniteLegale: IUniteLegale
): Promise<IOrganismeFormation | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.estOrganismeFormation) {
      throw new HttpNotFound('Not organisme de formation');
    }
    return await clientOrganismeFormation(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    logErrorInSentry('Error in Organisme de formation', {
      siren: uniteLegale.siren,
      details: e.toString(),
    });
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
