import { Metadata } from 'next';
import ExportCsv from './ExportCsv';

export const metadata: Metadata = {
  title: 'Budget de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/export-csv',
  },
  robots: 'noindex, nofollow',
};

export default function ExportCSV() {
  return <ExportCsv />;
}
