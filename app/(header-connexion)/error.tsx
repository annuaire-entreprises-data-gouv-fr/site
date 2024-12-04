'use client';

import { ConnexionSubLayout } from '#components-ui/connexion-layout';
import connexionFailedPicture from '#components-ui/illustrations/connexion-failed';
import constants from '#models/constants';
import { NextAppError, useLogFatalErrorAppClient } from 'hooks';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Votre tentative de connexion a échoué',
  alternates: {
    canonical:
      'https://annuaire-entreprises.data.gouv.fr/connexion/echec-connexion',
  },
  robots: 'noindex, nofollow',
};

export default function ErrorPage({ error }: { error: NextAppError }) {
  useLogFatalErrorAppClient(error);
  return (
    <ConnexionSubLayout img={connexionFailedPicture}>
      <h1>Votre tentative de connexion a échoué</h1>
      <p>
        Merci de réessayer plus tard. Si le problème se reproduit, merci de{' '}
        <a href={constants.links.parcours.contact}>nous contacter.</a>
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </ConnexionSubLayout>
  );
}
