import { ReactNode } from 'react';
import { PrintNever } from '#components-ui/print-visibility';

export function BrowserIsOutdatedBanner({ children }: { children: ReactNode }) {
  return (
    <PrintNever>
      <div
        id="browser-is-outdated"
        role="dialog"
        aria-label="Votre navigateur est obsolète"
      />
      {children}
      {/* This script is at the end of the page to not block the rendering process and improve LCP */}
      <script
        //  Show warning for browsers
        //  1. without Optional chaining
        //    - https://caniuse.com/mdn-javascript_operators_optional_chaining
        //    - https://stackoverflow.com/questions/66288922/check-if-optional-chaining-is-supported
        //  2. without public class fields
        //    - https://caniuse.com/?search=mdn-javascript_classes_public_class_fields
        dangerouslySetInnerHTML={{
          __html: `
        (function () {
          try {
            eval('var foo = {}; foo?.bar'); // 1. Optional chaining
            eval('class A { foo=1 }');      // 2. Class fields
          } catch (e) {
            window.IS_OUTDATED_BROWSER = true;
            var browserIsOutdated = document.getElementById('browser-is-outdated');
            browserIsOutdated.innerHTML = '<div class="fr-container"> <style>#browser-is-outdated{padding-top: 15px; padding-bottom: 15px; font-size: 0.9rem; width: 100%; background-color: #b50800; color: #fff; border-bottom: 2px solid #000091;}#browser-is-outdated h1{color: #fff; margin-top: 0;}</style> <h1>⚠️ Votre navigateur est obsolète</h1> <p> La plupart des fonctionalités de ce site <strong>ne fonctionneront pas</strong>. Vous pourrez essentiellement : </p><ul> <li> Rechercher une entreprise par son nom ou son SIREN </li><li>Consulter la fiche résumé de l’entreprise</li></ul> <p> Avoir un navigateur à jour est <a target="_blank" rel="noreferrer noopener" href="https://www.ssi.gouv.fr/entreprise/precautions-elementaires/bonnes-pratiques-de-navigation-sur-linternet/" >fortement recommandé par l’ANSSI</a> pour naviguer sur internet en sécurité. </p></div>';
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
    </PrintNever>
  );
}
