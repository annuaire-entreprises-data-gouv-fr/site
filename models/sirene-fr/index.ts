import { HttpNotFound } from '#clients/exceptions';
import {
  clientSireneInsee,
  clientSireneInseeCount,
} from '#clients/sirene-insee/export-csv';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ExportCsvInput } from 'app/api/export-csv/input-validation';

export const getEtablissementListe = async (
  searchParams: ExportCsvInput
): Promise<string | IAPINotRespondingError> => {
  try {
    return await clientSireneInsee(searchParams);
  } catch (e: any) {
    throw e;
  }
};

export const getEtablissementListeCount = async (
  searchParams: ExportCsvInput
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
