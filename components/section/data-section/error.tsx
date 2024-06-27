import { Error } from '#components-ui/alerts';
import { IDataFetchingState } from '#models/data-fetching';

export default function DataFetchErrorExplanation({
  fetchErrorType,
}: {
  fetchErrorType:
    | IDataFetchingState.CONNECTIVITY_ERROR
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
