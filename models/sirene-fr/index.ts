import { HttpNotFound } from '#clients/exceptions';
import {
  clientSireneInsee,
  clientSireneInseeCount,
  SireneSearchParams,
} from '#clients/sirene-insee/export-csv';
import { IAPINotRespondingError } from '#models/api-not-responding';

export const getEtablissementListe = async (
  searchParams: SireneSearchParams
): Promise<string | IAPINotRespondingError> => {
  try {
    return await clientSireneInsee(searchParams);
  } catch (e: any) {
    throw e;
  }
};

export const getEtablissementListeCount = async (
  searchParams: SireneSearchParams
): Promise<number> => {
  try {
    return await clientSireneInseeCount(searchParams);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return 0;
    }
    throw e;
  }
};
