import { ConnexionSubLayout } from '#components-ui/connexion-layout';
import connexionRefusedPicture from '#components-ui/illustrations/connexion-failed';
import constants from '#models/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Votre administration est inconnue de nos services',
  robots: 'noindex, nofollow',
};

export default function AdministrationInconnuePage() {
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Votre administration est inconnue de nos services</h1>
      <p>
        Votre administration est encore inconnue de nos services. Pouvez-vous
        s’il vous plait{' '}
        <a href={constants.links.parcours.contact}>nous contacter</a>, afin que
        nous vous activions les accès ?
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </ConnexionSubLayout>
  );
}
