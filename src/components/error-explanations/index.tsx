import type { PropsWithChildren } from "react";
import { Link } from "#/components/Link";
import ButtonLink from "#/components-ui/button";
import constants from "#/models/constants";

const ErrorTemplate: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="content-container">
    {children}
    <p>
      Si vous êtes arrivé sur cette page en cliquant sur un lien du site, merci
      de <Link href={constants.links.parcours.contact}>nous contacter</Link>{" "}
      pour que nous puissions trouver la panne 🕵️‍♀️.
    </p>
    <p>En attendant, vous pouvez toujours :</p>
    <ul className="fr-btns-group fr-btns-group--inline-md">
      <li>
        <ButtonLink alt to="/faq">
          Consulter notre page d’aide
        </ButtonLink>
      </li>
      <li>
        <span>&nbsp;</span>
        <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
      </li>
    </ul>
  </div>
);

const ClientErrorExplanations = ({ error }: { error?: Error }) => (
  <ErrorTemplate>
    {error?.name === "ChunkLoadError" ? (
      <>
        <h1>Erreur lors du chargement de la page</h1>
        <p>
          Il semblerait qu’une partie de la page n’a pas pu être chargée. Cela
          peut arriver si vous avez une connexion internet instable ou si vous
          utilisez un bloqueur de publicité.
        </p>
        <p>
          Si la situation perdure, merci de{" "}
          <Link href={constants.links.parcours.contact}>nous contacter</Link>{" "}
          pour que nous puissions trouver la panne 🕵️‍♀️.
        </p>
      </>
    ) : (
      <>
        <h1>Oh non, c’est la panne 😱</h1>
        <p>
          Si vous voyez cette page, c’est que votre navigateur a rencontré une
          erreur en essayant d’afficher cette page. Pas d’inquiétude, le reste
          du site fonctionne toujours !
        </p>
        <p>
          Ce problème a été automatiquement signalé à notre équipe technique,
          qui va essayer de le corriger au plus vite.
        </p>
        <p>Vous pouvez essayer de recharger la page ou de revenir plus tard.</p>
      </>
    )}
  </ErrorTemplate>
);

const ErrorNotFoundExplanations = () => (
  <ErrorTemplate>
    <h1>Cette page est introuvable 🔍</h1>
    <p>
      Si vous êtes arrivé sur cette page en tapant une url dans votre
      navigateur, c’est probable que vous vous soyez trompé d’url.
    </p>
  </ErrorTemplate>
);

const SearchErrorExplanations = () => (
  <div>
    <p>
      Le moteur de recherche est momentanément indisponible et devrait{" "}
      <Link href="/rechercher">fonctionner de nouveau</Link> dans quelques
      instants.
    </p>
    <p>
      Si la situation perdure, merci de{" "}
      <Link href={constants.links.parcours.contact}>nous contacter</Link> pour
      que nous puissions trouver la panne 🕵️‍♀️.
    </p>
  </div>
);

export {
  ClientErrorExplanations,
  ErrorNotFoundExplanations,
  SearchErrorExplanations,
};
