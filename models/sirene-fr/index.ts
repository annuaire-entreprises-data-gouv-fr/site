import type { Readable } from "node:stream";
import type { ExportCsvInput } from "app/api/export-sirene/input-validation";
import { HttpNotFound } from "#clients/exceptions";
import {
  clientSireneInsee,
  clientSireneInseeCount,
} from "#clients/sirene-insee/export-sirene";

export const getEtablissementListe = async (
  searchParams: ExportCsvInput
): Promise<Readable> => await clientSireneInsee(searchParams);

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
