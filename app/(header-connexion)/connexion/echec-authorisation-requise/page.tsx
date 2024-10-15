import { ConnexionSubLayout } from '#components-ui/connexion-layout';
import connexionRefusedPicture from '#components-ui/illustrations/connexion-refused';
import constants from '#models/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vous n’êtes pas autorisé(e) à accéder à cette partie du site',
  alternates: {
    canonical:
      'https://annuaire-entreprises.data.gouv.fr/connexion/echec-authorisation-requise',
  },
  robots: 'noindex, nofollow',
};

const ConnexionRefused = () => {
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Vous n’êtes pas autorisé(e) à accéder à cette partie du site</h1>
      <p>Cet espace est réservé aux agents publics habilités.</p>
      <p>
        Vous êtes agent(e) du service public et vous souhaiter accéder au
        service&nbsp;:{' '}
        <a href={constants.links.parcours.contact}>contactez-nous.</a>
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </ConnexionSubLayout>
  );
};

export default ConnexionRefused;
