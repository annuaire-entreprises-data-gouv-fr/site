import { Metadata } from 'next';
import ChangelogWithFilters from './_components';

export const metadata: Metadata = {
  title: 'Historique des changements',
  robots: 'noindex, nofollow',
  alternates: {
    canonical:
      'https://annuaire-entreprises.data.gouv.fr/historique-des-modifications',
  },
};

export default async function ChangelogPage() {
  return (
    <>
      <h1>Quoi de neuf sur l’Annuaire des Entreprises ?</h1>
      <ChangelogWithFilters />
    </>
  );
}
