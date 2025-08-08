import { HttpNotFound } from '#clients/exceptions';
import {
  clientExportSireneInsee,
  clientExportSireneInseeCount,
} from '#clients/sirene-insee/export/export-csv';
import { ExportCsvInput } from 'app/api/export-csv/input-validation';

export const getEtablissementListe = async (
  searchParams: ExportCsvInput
): Promise<string> => {
  try {
    return await clientExportSireneInsee(searchParams);
  } catch (e: any) {
    throw e;
  }
};

export const getEtablissementListeCount = async (
  searchParams: ExportCsvInput
): Promise<number> => {
  try {
    return await clientExportSireneInseeCount(searchParams);
  } catch (e: any) {
    if (e instanceof HttpNotFound) {
      return 0;
    }
    throw e;
  }
};
