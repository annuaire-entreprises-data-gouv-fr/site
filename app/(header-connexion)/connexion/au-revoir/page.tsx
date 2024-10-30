import { ConnexionSubLayout } from '#components-ui/connexion-layout';
import logoutPicture from '#components-ui/illustrations/logout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vous êtes bien deconnecté',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/connexion/au-revoir',
  },
  robots: 'noindex, nofollow',
};

export default function ConnexionGoodbyePage() {
  return (
    <ConnexionSubLayout img={logoutPicture}>
      <h1>Vous êtes bien déconnecté(e)</h1>
      <p>Merci de votre visite</p>
      <a href="/">← Revenir au moteur de recherche</a>
    </ConnexionSubLayout>
  );
}
