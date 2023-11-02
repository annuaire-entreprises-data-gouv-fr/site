import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import constants from '#models/constants';

export const BrowserIsOutdatedBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      className="browser-is-outdated"
      role="dialog"
      aria-label="Votre navigateur est obsolète"
    >
      <div className="fr-container">
        <h1>⚠️ Votre navigateur est obsolète </h1>
        <p>
          La plupart des fonctionalités de ce site ne fonctionneront pas. Vous
          pourrez uniquement :
        </p>
        <ul>
          <li>Rechercher une entreprise par son nom ou son SIREN</li>
          <li>Consulter la fiche résumé de l’entreprise</li>
        </ul>
        <p>
          Avoir un navigateur à jour est{' '}
          <a
            target="_blank"
            rel="noreferrer noopener"
            href="https://www.ssi.gouv.fr/entreprise/precautions-elementaires/bonnes-pratiques-de-navigation-sur-linternet/"
          >
            fortement recommandé par l’ANSSI
          </a>{' '}
          pour naviguer sur internet en sécurité.
        </p>
      </div>
    </div>
    <style jsx>{`
      .browser-is-outdated {
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 0.9rem;
        width: 100%;
        background-color: #ffd0d0;
        color: #000;
        font-family: 'Marianne', sans-serif;
        border-bottom: 2px solid ${constants.colors.frBlue};
      }
      h1 {
        margin-top: 0;
      }
    `}</style>
  </PrintNever>
);
