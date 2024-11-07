import { ConnexionSubLayout } from '#components-ui/connexion-layout';
import connexionRefusedPicture from '#components-ui/illustrations/connexion-failed';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Vous n’êtes pas autorisé(e) à accéder à l’espace agent',
  robots: 'noindex, nofollow',
};

export default function RequiredHabilitationPage() {
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Vous n’êtes pas autorisé(e) à accéder à l’espace agent</h1>
      <div>Seuls peuvent accéder à l’espace agent public :</div>
      <ul>
        <li>
          les membres d’une administration, d’une collectivité ou d’un service
          public
        </li>
        <li>
          les membres d’une organisation privée dotée d’une mission de service
          public
        </li>
      </ul>
      <p>
        Votre organisation{' '}
        <strong>ne fait pas partie de la liste des services publics</strong>.
        Vous pouvez{' '}
        <a
          href="https://www.demarches-simplifiees.fr/commencer/demande-d-ajout-a-la-liste-des-services-publics"
          target="_blank"
          rel="noopener noreferrer"
        >
          demander l’ajout de votre organisation
        </a>{' '}
        à la liste.
      </p>
      <p>
        Si votre demande est acceptée, vous obtiendrez automatiquement l’accès à
        l’espace agent.
      </p>
      <a href="/">← Retourner au moteur de recherche</a>
    </ConnexionSubLayout>
  );
}
