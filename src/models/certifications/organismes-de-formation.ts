import { HttpNotFound } from "#/clients/exceptions";
import { clientOrganismeFormation } from "#/clients/open-data-soft/clients/qualiopi";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import type { Siren } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";

export interface IOrganismeFormation {
  lastModified: string | null;
  qualiopiCertified: boolean;
  records: {
    nda: string | null;
    exNda: string | null;
    stagiaires: number | null;
    formateurs: number | null;
    certifications: string[];
    specialite: string;
    dateDeclaration: string | null;
    region: string | null;
  }[];
}

export const getOrganismesDeFormation = async (
  siren: Siren,
  estOrganismeFormation: boolean
): Promise<IOrganismeFormation | IAPINotRespondingError> => {
  try {
    if (!estOrganismeFormation) {
      throw new HttpNotFound("Not organisme de formation");
    }
    return await clientOrganismeFormation(siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "OrganismeFormation",
        context: {
          siren,
        },
        administration: EAdministration.MTPEI,
      })
    );
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
