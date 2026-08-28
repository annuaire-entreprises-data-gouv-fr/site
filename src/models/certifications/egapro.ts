import { clientEgapro } from "#/clients/egapro";
import { clientEgaproRepresentationEquilibre } from "#/clients/egapro/representation-equilibre";
import { HttpNotFound } from "#/clients/exceptions";
import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
} from "#/models/api-not-responding";
import { FetchRessourceException } from "#/models/exceptions";
import type { Siren } from "#/utils/helpers";
import logErrorInSentry from "#/utils/sentry";

export interface IEgapro {
  index: {
    employeesSizeRange: string;
    moreThan1000: boolean;
    lessThan250: boolean;
    years: string[];
    indexYears: string[];
    scores: {
      notes: number[];
      augmentations: number[];
      augmentationsPromotions: number[];
      congesMaternite: number[];
      hautesRemunerations: number[];
      promotions: number[];
      remunerations: number[];
    };
  };
  representation: {
    years: string[];
    scores: {
      pourcentageFemmesCadres: number[];
      pourcentageHommesCadres: number[];
      pourcentageFemmesMembres: number[];
      pourcentageHommesMembres: number[];
    };
  } | null;
}

export const getEgapro = async (
  siren: Siren,
  egaproRenseignee: boolean
): Promise<IEgapro | IAPINotRespondingError> => {
  try {
    if (!egaproRenseignee) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    const index = await clientEgapro(siren);
    return {
      index,
      representation: index.moreThan1000
        ? await clientEgaproRepresentationEquilibre(siren).catch((e) => {
            if (e instanceof HttpNotFound) {
              // some moreThan1000 uniteLegale dont have representation
              return null;
            }
            throw e;
          })
        : null,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: "Egapro",
        context: {
          siren,
        },
        administration: EAdministration.MTPEI,
      })
    );
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
