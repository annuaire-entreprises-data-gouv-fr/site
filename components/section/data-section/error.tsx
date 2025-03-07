import { Error } from '#components-ui/alerts';
import { IDataFetchingState } from '#models/data-fetching';

export default function DataFetchErrorExplanation({
  fetchErrorType,
}: {
  fetchErrorType:
    | IDataFetchingState.CONNECTIVITY_ERROR
    | IDataFetchingState.AGENT_OVER_RATE_LIMITS
    | IDataFetchingState.TOO_MANY_REQUESTS
    | IDataFetchingState.MODEL_ERROR;
}) {
  if (fetchErrorType === IDataFetchingState.CONNECTIVITY_ERROR) {
    return (
      <Error>
        <strong>Erreur lors du chargement de la donnée</strong>
        <p>
          Votre navigateur a rencontré une erreur en essayant de charger cette
          donnée. Cela peut arriver si vous avez une connexion internet
          instable, si vous êtes sur un réseau public, ou derrière un VPN.
        </p>
        <p>
          Vous pouvez essayer de recharger la page pour corriger le problème.
        </p>
      </Error>
    );
  }
  if (fetchErrorType === IDataFetchingState.AGENT_OVER_RATE_LIMITS) {
    return (
      <Error>
        <strong>Trop de requêtes</strong>
        <p>
          Nous avons détecté un nombre important de requêtes de votre part et
          votre accès a été temporairement limité.
        </p>
        <p className="fr-text--sm">
          Si la situation perdure, merci de{' '}
          <a href="https://www.data.gouv.fr/fr/faq/#contact">nous contacter</a>{' '}
          pour que nous investiguions.
        </p>
      </Error>
    );
  }
  if (fetchErrorType === IDataFetchingState.TOO_MANY_REQUESTS) {
    return (
      <Error>
        <strong>Trop de requêtes</strong>
        <p>
          Vous avez dépassé le nombre de requêtes autorisées auprès de cette
          administration.
        </p>
        <p>
          Veuillez réessayer plus tard. Si le problème persiste, merci de nous
          contacter.
        </p>
      </Error>
    );
  }
  return (
    <Error>
      <strong>Erreur lors du chargement de la donnée</strong>
      <p>
        Une erreur est survenue lors de la récupération de la donnée. Cela vient
        probablement d’un problème technique de notre côté. Pas d’inquiétude, le
        reste du site fonctionne toujours !
      </p>

      <p>
        Ce problème a été automatiquement signalé à notre équipe technique, qui
        va essayer de le corriger au plus vite.
      </p>
      <p className="fr-text--sm">
        Si la situation perdure, merci de{' '}
        <a href="https://www.data.gouv.fr/fr/faq/#contact">nous contacter</a>{' '}
        pour que nous puissions trouver la panne 🕵️‍♀️.
      </p>
    </Error>
  );
}
