import routes from '#clients/routes';
import { exportCsvClientGet } from '#clients/sirene-insee';
import constants from '#models/constants';
import { ExportCsvInput } from 'app/api/export-csv/input-validation';
import { SireneQueryBuilder } from './build-query';

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
  const url = `${routes.sireneInsee.listEtablissements}?q=${encodeURIComponent(
    queryBuilder.build()
  )}&nombre=200000&noLink=true`;

  const response = await exportCsvClientGet<string>(url, {
    headers: {
      Accept: 'text/csv',
      'Accept-Encoding': 'gzip',
    },
    timeout: constants.timeout.XXXL,
  });

  return (await response) as string;
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
  const url = `${routes.sireneInsee.listEtablissements}?q=${encodeURIComponent(
    queryBuilder.build()
  )}&nombre=0&noLink=true`;

  const response = await exportCsvClientGet<SireneJsonSearchResult>(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
    },
  });

  return response.header.total;
};
