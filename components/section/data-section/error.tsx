import { Error } from '#components-ui/alerts';
import constants from '#models/constants';
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
        <strong>Plafond de consultation atteint</strong>
        <p>
          Pour des raisons de sécurité, nous avons mis en place un nombre de
          consultations maximal autorisé sur les données réservées aux agents.
        </p>
        <p>
          Vous avez dépassé ce plafond. En conséquence, vous allez devoir
          attendre avant de pouvoir de nouveau consulter cette donnée.
        </p>
        <p>
          Pour en savoir plus,{' '}
          <a href={constants.links.documentation.agentRateLimiting}>
            consultez notre page de documentation
          </a>
          .
        </p>
        <p>
          Si la situation perdure, vous pouvez{' '}
          <a href={constants.links.parcours.contact}>nous contacter</a>.
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
        <p>
          Si la situation perdure, vous pouvez{' '}
          <a href={constants.links.parcours.contact}>nous contacter</a> pour que
          nous puissions trouver la panne 🕵️‍♀️.
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
      <p>
        Si la situation perdure, merci de{' '}
        <a href={constants.links.parcours.contact}>nous contacter</a> pour que
        nous puissions trouver la panne 🕵️‍♀️.
      </p>
    </Error>
  );
}
