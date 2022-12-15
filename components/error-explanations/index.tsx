import { PropsWithChildren } from 'react';
import ButtonLink from '#components-ui/button';
import constants from '#models/constants';

const ErrorTemplate: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className="content-container">
    {children}
    <p>
      Si vous êtes arrivé sur cette page en cliquant sur un lien du site, merci
      de nous contacter via{' '}
      <a href={constants.links.mailto}>{constants.links.mail}</a> pour que nous
      puissions trouver la panne 🕵️‍♀️.
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
    <h1>Oh non 😱 ! C’est la panne ⚠️</h1>
    <p>
      Si vous voyez cette page, c’est que l’ordinateur qui fait marcher ce site
      internet a rencontré une petite panne. Pas d’inquiétude, le reste du site
      fonctionne toujours !
    </p>
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
      Le moteur de recherche est momentanément indisponible et devrait
      fonctionner de nouveau dans quelques instants.
    </p>
    <p>
      Si la situation perdure, merci de nous contacter via{' '}
      <a href={constants.links.mailto}>{constants.links.mail}</a> pour que nous
      puissions trouver la panne 🕵️‍♀️.
    </p>
  </div>
);

export {
  ErrorNotFoundExplanations,
  ServerErrorExplanations,
  SearchErrorExplanations,
};
