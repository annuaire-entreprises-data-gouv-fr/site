import { Error } from '#components-ui/alerts';

export default function DataFetchErrorExplanation() {
  return (
    <Error>
      <strong>Erreur lors du chargement de la donnée</strong>
      <p>
        Votre navigateur a rencontré une erreur en essayant de charger cette
        donnée. Cela peut arriver si vous avez une connexion internet instable
        ou si vous utilisez un bloqueur de publicité.
      </p>
      <p>Vous pouvez essayer de recharger la page ou de revenir plus tard.</p>
      <p className="fr-text--sm">
        Si la situation perdure, merci de{' '}
        <a href="https://www.data.gouv.fr/fr/faq/#contact">nous contacter</a>{' '}
        pour que nous puissions trouver la panne 🕵️‍♀️.
      </p>
    </Error>
  );
}
