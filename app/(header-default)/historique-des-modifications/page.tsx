import FAQLink from '#components-ui/faq-link';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import ChangelogWithFilters from './_components';

export const metadata: Metadata = {
  title: 'Historique des changements',
  alternates: {
    canonical:
      'https://annuaire-entreprises.data.gouv.fr/historique-des-modifications',
  },
  robots: 'noindex, follow',
};

export default async function ChangelogPage() {
  const session = await getSession();
  return (
    <>
      <h1>Quoi de neuf sur l’Annuaire des Entreprises ?</h1>
      <p>
        Retrouvez les nouveautés du{' '}
        <FAQLink tooltipLabel="Site public">
          Ensemble des pages accessibles à tous les internautes, gratuitement et
          sans création de compte
        </FAQLink>
        , de l’
        <a href="/lp/agent-public">Espace agent public</a> et de l’
        <a href="/donnees/api-entreprises">API de Recherche d’Entreprises</a>.
      </p>
      <ChangelogWithFilters session={session} />
    </>
  );
}
