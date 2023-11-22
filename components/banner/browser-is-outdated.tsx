import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';

export const BrowserIsOutdatedBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      id="browser-is-outdated"
      role="dialog"
      aria-label="Votre navigateur est obsolète"
    />

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
            window.IS_OUTDATED_BROWSER = true;
            var browserIsOutdated = document.getElementById('browser-is-outdated');
            browserIsOutdated.innerHTML = '<div class="fr-container"> <style>#browser-is-outdated{padding-top: 15px; padding-bottom: 15px; font-size: 0.9rem; width: 100%; background-color: #b50800; color: #fff; font-family: "Marianne", sans-serif; border-bottom: 2px solid #000091;}#browser-is-outdated h1{color: #fff; margin-top: 0;}</style> <h1>⚠️ Votre navigateur est obsolète</h1> <p> La plupart des fonctionalités de ce site <b>ne fonctionneront pas</b>. Vous pourrez essentiellement : </p><ul> <li> Rechercher une entreprise par son nom ou son SIREN </li><li>Consulter la fiche résumé de l’entreprise</li></ul> <p> Avoir un navigateur à jour est <a target="_blank" rel="noreferrer noopener" href="https://www.ssi.gouv.fr/entreprise/precautions-elementaires/bonnes-pratiques-de-navigation-sur-linternet/" >fortement recommandé par l’ANSSI</a> pour naviguer sur internet en sécurité. </p></div>';
            browserIsOutdated.style.display = 'block';
            window._paq = window._paq || [];
            window._paq.push([
                'trackEvent',
                'error',
                'outdated-browser',
                'warning-displayed',
            ]);
          }
        })()
        `,
      }}
    ></script>
    <style jsx>{`
      #browser-is-outdated {
        display: none;
      }
    `}</style>
  </PrintNever>
);
