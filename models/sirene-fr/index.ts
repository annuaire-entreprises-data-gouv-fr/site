import { HttpNotFound } from '#clients/exceptions';
import {
  clientSireneInsee,
  clientSireneInseeCount,
  SireneSearchParams,
} from '#clients/sirene-fr';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';

export const getEtablissementListe = async (
  searchParams: SireneSearchParams
): Promise<string | IAPINotRespondingError> => {
  try {
    return await clientSireneInsee(searchParams);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return APINotRespondingFactory(EAdministration.INSEE, 404);
    }
    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};

export const getEtablissementListeCount = async (
  searchParams: SireneSearchParams
): Promise<number | IAPINotRespondingError> => {
  try {
    return await clientSireneInseeCount(searchParams);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return 0;
    }
    return APINotRespondingFactory(EAdministration.INSEE, 500);
  }
};
