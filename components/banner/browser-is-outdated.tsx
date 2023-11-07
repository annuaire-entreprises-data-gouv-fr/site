import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import constants from '#models/constants';

export const BrowserIsOutdatedBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      id="browser-is-outdated"
      role="dialog"
      aria-label="Votre navigateur est obsolète"
    >
      <div className="fr-container">
        <h1>⚠️ Votre navigateur est obsolète </h1>
        <p>
          La plupart des fonctionalités de ce site <b>ne fonctionneront pas</b>.
          Vous pourrez essentiellement :
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

    <script
      //  Show warning for browsers without Optional chaining
      //  https://caniuse.com/mdn-javascript_operators_optional_chaining
      //  https://stackoverflow.com/questions/66288922/check-if-optional-chaining-is-supported
      dangerouslySetInnerHTML={{
        __html: `
        (function () {
          try {
            eval('var foo = {}; foo?.bar');
          } catch (e) {
            document.getElementById('browser-is-outdated').style.display = 'block';
          }
        })()
        `,
      }}
    ></script>
    <style jsx>{`
      #browser-is-outdated {
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 0.9rem;
        width: 100%;
        display: none;
        background-color: #b50800;
        color: #fff;
        font-family: 'Marianne', sans-serif;
        border-bottom: 2px solid ${constants.colors.frBlue};
      }
      h1 {
        color: #fff;
        margin-top: 0;
      }
    `}</style>
  </PrintNever>
);
