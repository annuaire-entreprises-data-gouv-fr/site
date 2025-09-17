import routes from '#clients/routes';
import { exportCsvClientGet } from '#clients/sirene-insee';
import constants from '#models/constants';
import { ExportCsvInput } from 'app/api/export-sirene/input-validation';
import { Readable } from 'stream';
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
  const q = queryBuilder.build();
  const champs = SireneQueryBuilder.getFieldsString();
  const url = `${routes.sireneInsee.listEtablissements}?q=${q}&champs=${champs}&nombre=200000&noLink=true`;

  const stream = await exportCsvClientGet<Readable>(url, {
    headers: {
      Accept: 'text/csv',
      'Accept-Encoding': 'gzip',
    },
    responseType: 'stream',
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
  const champs = 'siret';
  const url = `${routes.sireneInsee.listEtablissements}?q=${q}&champs=${champs}&nombre=0&noLink=true`;

  const response = await exportCsvClientGet<SireneJsonSearchResult>(url, {
    headers: {
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
    },
  });

  return response.header.total;
};
