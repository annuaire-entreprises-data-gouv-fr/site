import { Metadata } from 'next';
import ExportCsv from './ExportCsv';

export const metadata: Metadata = {
  title: 'Générer une liste CSV d‘entreprises | L’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/export-csv',
  },
  robots: 'noindex, nofollow',
};

export default function ExportCSV() {
  return <ExportCsv />;
}
