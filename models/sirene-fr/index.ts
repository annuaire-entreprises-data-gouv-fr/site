import { HttpNotFound } from "#clients/exceptions";
import {
  clientSireneInsee,
  clientSireneInseeCount,
} from "#clients/sirene-insee/export-sirene";
import type { ExportCsvInput } from "app/api/export-sirene/input-validation";
import type { Readable } from "stream";

export const getEtablissementListe = async (
  searchParams: ExportCsvInput
): Promise<Readable> => {
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
