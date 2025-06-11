import routes from '#clients/routes';
import { exportCsvClientGet } from '#clients/sirene-insee';
import constants from '#models/constants';
import { SireneQueryBuilder } from './build-query';

export interface SireneSearchParams {
  headcount?: {
    min: number;
    max: number;
  };
  categories?: ('PME' | 'ETI' | 'GE')[];
  activity?: 'all' | 'active' | 'ceased';
  legalUnit?: 'all' | 'hq';
  legalCategory?: string;
  naf?: string;
  label?: string;
  location?: string;
  creationDate?: {
    from?: string;
    to?: string;
  };
  updateDate?: {
    from?: string;
    to?: string;
  };
  ess?: {
    inclure: boolean;
    inclureNo: boolean;
    inclureNonRenseigne: boolean;
  };
  mission?: {
    inclure: boolean;
    inclureNo: boolean;
    inclureNonRenseigne: boolean;
  };
  siretsAndSirens?: string[];
}

interface SireneJsonSearchResult {
  header: {
    statut: number;
    message: string;
    total: number;
    debut: number;
    nombre: number;
  };
}

export const clientSireneInsee = async (params: SireneSearchParams) => {
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

export const clientSireneInseeCount = async (params: SireneSearchParams) => {
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
