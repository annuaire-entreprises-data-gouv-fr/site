import type { ExportCsvInput } from "app/api/export-sirene/input-validation";
import type { Readable } from "stream";
import routes from "#clients/routes";
import { exportCsvClientPost } from "#clients/sirene-insee";
import constants from "#models/constants";
import { SireneQueryBuilder } from "./build-query";

interface SireneJsonSearchResult {
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
}

export const clientSireneInsee = async (params: ExportCsvInput) => {
  const queryBuilder = new SireneQueryBuilder(params);
  const q = queryBuilder.build();
  const champs = SireneQueryBuilder.getFieldsString();
  const url = routes.sireneInsee.listEtablissements;

  const stream = await exportCsvClientPost<Readable>(url, {
    headers: {
      Accept: "text/csv",
      "Accept-Encoding": "gzip",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      q,
      champs,
      nombre: "200000",
      noLink: "true",
    },
    responseType: "stream",
    timeout: constants.timeout.XXXL,
  });

  return stream;
};

export interface ISireneInseeCount {
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
  etablissements: any[];
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
