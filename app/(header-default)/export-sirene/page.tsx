import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ExportCsv from './export-csv';

export const metadata: Metadata = {
  title: 'Générer une liste CSV d‘entreprises | L’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/export-csv',
  },
  robots: 'index, follow',
};

export default function ExportCSV() {
  if (process.env.EXPORT_CSV_ENABLED !== 'enabled') {
    return redirect('/');
  }
  return <ExportCsv />;
}
