import ButtonLink from '#components-ui/button';
import ButtonFranceConnect from '#components-ui/button-france-connect';
import { getHidePersonalDataRequestFCSession } from '#utils/session';
import useSession from 'hooks/use-session';

export function ConnectionFranceConnect() {
  const session = useSession();
  const missingDataInFranceConnect =
    session &&
    session.hidePersonalDataRequestFC &&
    !getHidePersonalDataRequestFCSession(session);
  const franceConnectInfo =
    session && getHidePersonalDataRequestFCSession(session);
  return (
    <>
      {missingDataInFranceConnect ? (
        <div className="fr-alert fr-alert--error" role="alert">
          <p className="fr-alert__title">
            Vos informations personnelles sont incomplètes
          </p>
          <p>
            Les informations personnelles nécessaires à la création de la
            demande ne sont pas disponibles dans votre compte FranceConnect.
          </p>
        </div>
      ) : franceConnectInfo ? (
        <>
          <h2>Authentification réussie</h2>
          <p>
            Vous êtes correctement authentifié avec FranceConnect en tant que{' '}
            <strong>
              {franceConnectInfo.firstName} {franceConnectInfo.familyName}
            </strong>
            . Vous pouvez désormais nous indiquer quel SIREN est concerné par
            votre demande.
          </p>
          <div className="layout-left">
            <ButtonLink
              role="listitem"
              to="/api/auth/france-connect/logout?pathFrom=%2Fformulaire%2Fsupprimer-donnees-personnelles-entreprise"
              alt
            >
              Me déconnecter
            </ButtonLink>
          </div>
        </>
      ) : (
        <>
          <h2>Authentification</h2>
          <p>
            La première étape est de vous authentifier avec FranceConnect, afin
            que nos services puissent vérifier que vous êtes bien dirigeant(e)
            de l’entreprise concernée.
          </p>
          <p>
            FranceConnect est la solution proposée par l’État pour sécuriser et
            simplifier la connexion à vos services en ligne.
          </p>
          <form action="/api/auth/france-connect/login" method="get">
            <ButtonFranceConnect />
          </form>
          <p className="fr-text--sm">
            <strong>
              Vous ne pouvez pas vous connecter avec FranceConnect ?
            </strong>
            <br />
            Dans ce cas vous pouvez nous écrire directement en précisant votre
            demande. Le temps de traitement pourra être plus long.{' '}
            <a href="mailto:annuaire-entreprises@data.gouv.fr?subject=Je%20souhaite%20cacher%20mes%20informations%20de%20dirigeant(e)&body=Bonjour%2C%20%0A%0AJe%20souhaite%20cacher%20mes%20informations%20de%20dirigeant(e)%20de%20mon%20entreprise.%0A%0AVoici%20le%20num%C3%A9ro%20Siren%20%2F%20Siret%20concern%C3%A9%20%3A">
              Faire ma demande par mail
            </a>
          </p>
        </>
      )}
    </>
  );
}
