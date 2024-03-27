import { PropsWithChildren } from 'react';
import ButtonLink from '#components-ui/button';
import constants from '#models/constants';

const ErrorTemplate: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="content-container">
    {children}
    <p>
      Si vous êtes arrivé sur cette page en cliquant sur un lien du site, merci
      de <a href={constants.links.parcours.contact}>nous contacter</a> pour que
      nous puissions trouver la panne 🕵️‍♀️.
    </p>
    <p>En attendant, vous pouvez toujours :</p>
    <div className="layout-left">
      <ButtonLink to="/faq" alt>
        Consulter notre page d’aide
      </ButtonLink>
      <span>&nbsp;</span>
      <ButtonLink to="/">Retourner à la page d’accueil</ButtonLink>
    </div>
  </div>
);

const ServerErrorExplanations = () => (
  <ErrorTemplate>
    <h1>Oh non, c’est la panne 😱</h1>
    <p>
      Si vous voyez cette page, c’est que l’ordinateur qui fait marcher ce site
      internet a rencontré une petite panne. Pas d’inquiétude, le reste du site
      fonctionne toujours !
    </p>
    <p>
      Ce problème a été automatiquement signalé à notre équipe technique, qui va
      essayer de le corriger au plus vite.
    </p>
  </ErrorTemplate>
);

const ClientErrorExplanations = ({ error }: { error?: Error }) => (
  <ErrorTemplate>
    {error?.name === 'ChunkLoadError' ? (
      <>
        <h1>Erreur lors du chargement de la page</h1>
        <p>
          Il semblerait qu’une partie de la page n’a pas pu être chargée. Cela
          peut arriver si vous avez une connexion internet instable ou si vous
          utilisez un bloqueur de publicité.
        </p>
        <p>
          Si la situation perdure, merci de{' '}
          <a href={constants.links.parcours.contact}>nous contacter</a> pour que
          nous puissions trouver la panne 🕵️‍♀️.
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
      Le moteur de recherche est momentanément indisponible et devrait{' '}
      <a href="/rechercher">fonctionner de nouveau</a> dans quelques instants.
    </p>
    <p>
      Si la situation perdure, merci de{' '}
      <a href={constants.links.parcours.contact}>nous contacter</a> pour que
      nous puissions trouver la panne 🕵️‍♀️.
    </p>
  </div>
);

export {
  ClientErrorExplanations,
  ErrorNotFoundExplanations,
  SearchErrorExplanations,
  ServerErrorExplanations,
};
