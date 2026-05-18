import { Link } from "#/components/Link";
import { ConnexionSubLayout } from "#/components-ui/connexion-layout";
import connexionFailedPicture from "#/components-ui/illustrations/connexion-failed";
import { useLogFatalErrorAppClient } from "#/hooks/use-log-fatal-error-app-client";
import constants from "#/models/constants";

export function HeaderConnexionError({ error }: { error: Error }) {
  useLogFatalErrorAppClient(error);
  return (
    <ConnexionSubLayout img={connexionFailedPicture}>
      <h1>Votre tentative de connexion a échoué</h1>
      <p>
        Merci de réessayer plus tard. Si le problème se reproduit, merci de{" "}
        <Link to={constants.links.parcours.contact}>nous contacter.</Link>
      </p>
      <Link to="/">← Retourner au moteur de recherche</Link>
    </ConnexionSubLayout>
  );
}
