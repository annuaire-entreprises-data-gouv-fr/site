import { HttpNotFound } from '#clients/exceptions';
import { clientSireneInsee, SireneSearchParams } from '#clients/sirene-fr';
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
