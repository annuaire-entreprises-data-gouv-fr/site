import { clientEgapro } from '#clients/egapro';
import { clientEgaproRepresentationEquilibre } from '#clients/egapro/representationEquilibre';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

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
  uniteLegale: IUniteLegale
): Promise<IEgapro | IAPINotRespondingError> => {
  try {
    if (!uniteLegale.complements.egaproRenseignee) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    const index = await clientEgapro(uniteLegale.siren);
    return {
      index,
      representation: index.moreThan1000
        ? await clientEgaproRepresentationEquilibre(uniteLegale.siren).catch(
            (e) => {
              if (e instanceof HttpNotFound) {
                // some moreThan1000 uniteLegale dont have representation
                return null;
              }
              throw e;
            }
          )
        : null,
    };
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.MTPEI, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'Egapro',
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.MTPEI,
      })
    );
    return APINotRespondingFactory(EAdministration.MTPEI, 500);
  }
};
