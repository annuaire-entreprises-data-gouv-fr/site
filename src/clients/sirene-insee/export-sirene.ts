import { Readable } from "node:stream";
import { HttpNotFound } from "#/clients/exceptions";
import routes from "#/clients/routes";
import { exportCsvClientPost } from "#/clients/sirene-insee/index.server";
import constants from "#/models/constants";
import { SireneQueryBuilder } from "./build-query";
import type { ExportCsvInput } from "./input-validation";
import { CSV_PAGE_SIZE, streamCsvPages } from "./paginated-csv";

interface SireneJsonSearchResult {
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
}

const fetchCsvPage = async (
  q: string,
  afterSiret?: string
): Promise<Readable> => {
  try {
    return await exportCsvClientPost<Readable>(
      routes.sireneInsee.listEtablissements,
      {
        headers: {
          Accept: "text/csv",
          "Accept-Encoding": "gzip",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {
          q: afterSiret ? `(${q}) AND siret:{${afterSiret} TO *]` : q,
          champs: SireneQueryBuilder.getFieldsString(),
          nombre: String(CSV_PAGE_SIZE),
          tri: "siret",
          noLink: "true",
        },
        responseType: "stream",
        timeout: constants.timeout.XXXXXL,
      }
    );
  } catch (e) {
    // INSEE answers 404 when there are no more rows, e.g. if some were removed since the count
    if (afterSiret && e instanceof HttpNotFound) {
      return Readable.from([]);
    }
    throw e;
  }
};

/**
 * Export CSV, fetched from INSEE page by page
 *
 * @param total number of rows to export, as returned by clientSireneInseeCount
 */
export const clientSireneInsee = async (
  params: ExportCsvInput,
  total: number
): Promise<Readable> => {
  const q = new SireneQueryBuilder(params).build();
  const firstPage = await fetchCsvPage(q);

  return Readable.from(
    streamCsvPages(
      (afterSiret) => fetchCsvPage(q, afterSiret),
      firstPage,
      total
    )
  );
};

export interface ISireneInseeCount {
  etablissements: any[];
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
}

export const clientSireneInseeCount = async (params: ExportCsvInput) => {
  const queryBuilder = new SireneQueryBuilder(params);
  const q = queryBuilder.build();
  // We only need the number of results
  const champs = "siret";
  const url = routes.sireneInsee.listEtablissements;

  const response = await exportCsvClientPost<SireneJsonSearchResult>(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      q,
      champs,
      nombre: "0",
      noLink: "true",
    },
  });

  return response.header.total;
};
