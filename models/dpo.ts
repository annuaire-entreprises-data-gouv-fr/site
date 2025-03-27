import { clientDPO } from '#clients/api-data-gouv/dpo';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from './core/types';

export interface IDPO {
  typeDPO: string;
  organismeDesigne: {
    siren: string;
    nom: string;
    secteurActivite: string;
    codeNAF: string;
    adressePostale: string;
    codePostal: string;
    ville: string;
    pays: string;
  };
  contact: {
    email: string;
    url: string;
    telephone: string;
    adressePostale: string;
    codePostal: string;
    ville: string;
    pays: string;
    autre: string;
  };
}

export const getDPO = async (
  uniteLegale: IUniteLegale
): Promise<IDPO | IAPINotRespondingError> => {
  try {
    return await clientDPO(uniteLegale.siren);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.CNIL, 404);
    }
    logErrorInSentry(
      new FetchRessourceException({
        cause: e,
        ressource: 'DigitalProtectionOfficer',
        context: {
          siren: uniteLegale.siren,
        },
        administration: EAdministration.CNIL,
      })
    );
    return APINotRespondingFactory(EAdministration.CNIL, 500);
  }
};
