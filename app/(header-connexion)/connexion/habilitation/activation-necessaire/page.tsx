import { ConnexionSubLayout } from '#components-ui/connexion-layout';
import connexionRefusedPicture from '#components-ui/illustrations/connexion-failed';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Votre compte doit être activé',
  robots: 'noindex, nofollow',
};

export default function ActivationComptePage() {
  return (
    <ConnexionSubLayout img={connexionRefusedPicture}>
      <h1>Votre compte n’est pas encore activé</h1>
      <p>
        Vous appartenez à un groupe et cela vous donne accès à l’espace agent.
        Cependant, votre compte doit d’abord <strong>être activé</strong> afin
        de bénéficier de vos nouveaux droits.
      </p>
      <p>
        <a
          href="https://roles.data.gouv.fr/ui/activation"
          target="_blank"
          rel="noreferrer noopener"
        >
          Activez votre compte
        </a>
        , puis{' '}
        <a href="https://annuaire-entreprises.data.gouv.fr/lp/agent-public">
          re-essayez de vous connecter
        </a>
        .
      </p>
    </ConnexionSubLayout>
  );
}
