import { ExportCsvInput } from 'app/api/export-csv/input-validation';

export interface ExtendedExportCsvInput extends ExportCsvInput {
  headcount: { min: number; max: number };
  categories: ('PME' | 'ETI' | 'GE')[];
  headcountEnabled: boolean;
  locations: Array<{
    type: 'cp' | 'dep' | 'reg' | 'insee';
    value: string;
    label: string;
  }>;
  legalCategories: string[];
}
