import { Metadata } from 'next';
import ExportCsv from './export-csv';

export const metadata: Metadata = {
  title: 'Générer une liste CSV d‘entreprises | L’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/export-sirene',
  },
  robots: 'index, follow',
};

export default function ExportCSV() {
  return <ExportCsv />;
}
