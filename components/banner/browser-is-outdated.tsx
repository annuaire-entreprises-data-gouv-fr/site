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
        <b>⚠️ Votre navigateur est obsolète : </b>
        le site est utilisable mais certaines fonctionnalités comme le
        déclenchement automatique des téléchargements, la recherche avancée ou
        le copier/coller ne fonctionneront pas.
        <br />
        Avoir un navigateur à jour est{' '}
        <a
          target="_blank"
          rel="noreferrer noopener"
          href="https://www.ssi.gouv.fr/entreprise/precautions-elementaires/bonnes-pratiques-de-navigation-sur-linternet/"
        >
          recommandé par l’ANSSI pour naviguer sur internet en sécurité
        </a>
        .
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
        border-bottom: 2px solid #000091;
      }
    `}</style>
  </PrintNever>
);
