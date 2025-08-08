import routes from '#clients/routes';
import { exportCsvClientGet } from '#clients/sirene-insee';
import constants from '#models/constants';
import { ExportCsvInput } from 'app/api/export-csv/input-validation';
import { SireneQueryBuilder } from './build-query';

const mapToDomainObject = (csvData: string): string => {
  const lines = csvData.split('\n');
  if (lines.length === 0) return csvData;

  const header = lines[0];
  const headerColumns = header.split(',').map(col => col.replace(/"/g, ''));
  
  // Find column indices for fields that need masking
  const statutDiffusionIndex = headerColumns.findIndex(col => 
    col.includes('statutDiffusion') || col.includes('statut_diffusion')
  );
  const enseigneIndex = headerColumns.findIndex(col => 
    col.includes('enseigne') || col.includes('Enseigne')
  );
  const denominationIndex = headerColumns.findIndex(col => 
    col.includes('denomination') || col.includes('Denomination')
  );
  const adresseIndex = headerColumns.findIndex(col => 
    col.includes('adresse') && !col.includes('Postale') && !col.includes('postale')
  );
  const adressePostaleIndex = headerColumns.findIndex(col => 
    col.includes('adressePostale') || col.includes('adresse_postale')
  );

  if (statutDiffusionIndex === -1) {
    return csvData; // No statutDiffusion column found, return as-is
  }

  const processedLines = [header]; // Keep header as-is

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const columns = line.split(',');
    const statutDiffusion = columns[statutDiffusionIndex]?.replace(/"/g, '');

    if (statutDiffusion === 'N') {
      // Mask sensitive fields with "ND"
      if (enseigneIndex !== -1 && columns[enseigneIndex]) {
        columns[enseigneIndex] = '"ND"';
      }
      if (denominationIndex !== -1 && columns[denominationIndex]) {
        columns[denominationIndex] = '"ND"';
      }
      if (adresseIndex !== -1 && columns[adresseIndex]) {
        columns[adresseIndex] = '"ND"';
      }
      if (adressePostaleIndex !== -1 && columns[adressePostaleIndex]) {
        columns[adressePostaleIndex] = '"ND"';
      }
    }

    processedLines.push(columns.join(','));
  }

  return processedLines.join('\n');
};

export const clientExportSireneInsee = async (params: ExportCsvInput) => {
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

  return mapToDomainObject(response);
};

export const clientExportSireneInseeCount = async (params: ExportCsvInput) => {
  const queryBuilder = new SireneQueryBuilder(params);
  const url = `${routes.sireneInsee.listEtablissements}?q=${encodeURIComponent(
    queryBuilder.build()
  )}&nombre=0&noLink=true`;

  const response = await exportCsvClientGet<{ header: { total: number } }>(
    url,
    {
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip',
      },
    }
  );

  return response.header.total;
};
