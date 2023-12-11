const head = (canonical: string, title: string, description: string) => `
<head>
  <title>${
    title ||
    'Les entreprises, associations et services publics de France, classés par départements et par code NAF'
  }</title>
  <meta name="description" content="${
    description ||
    'L’administration permet aux particuliers et agents publics de vérifier les informations juridiques officielles d’une entreprise : SIREN, SIRET, TVA Intracommunautaire, code APE/NAF, capital social, justificatif d’immatriculation, dirigeants, convention collective…'
  }">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="robots" content="index">
  <link rel="canonical" href="${canonical}" />
  <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png">
  <link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml">
  <link rel="shortcut icon" href="/favicons/favicon.ico" type="image/x-icon">
  <link rel="manifest" href="/favicons/manifest.webmanifest" cross-origin="use-credentials">
  <link rel="stylesheet" type="text/css" href="/dsfr-departements/dsfr.min.css">
  </head>
`;

export const renderPage = (
  body: string,
  canonical: string,
  title = '',
  description = ''
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    ${head(canonical, title, description)}
    <body>
      <style>div.body-wrapper { margin-top:40px; margin-bottom:50px; } h1 { margin-top:20px; font-size: 1.8rem; } div.body-wrapper a:not(.fr-breadcrumb__link) { line-height:2.1rem; } .pagination > a { padding: 0 5px; margin:5px 10px; display: inline-block; }</style>
      <header role="banner" class="fr-header"><div class="fr-header__body"><div class="fr-container"><div class="fr-header__body-row"><div class="fr-header__brand fr-enlarge-link"><div class="fr-header__brand-top"><div class="fr-header__logo"><a href="/" title="République française" class=""><p class="fr-logo">République<br />française</p></a></div><div class="fr-header__navbar"></div></div></div><div class="fr-header__tools"><div class="fr-header__tools-links"><ul class="fr-links-group"><li><a href="/" class="fr-link">Rechercher une entreprise</a></li></ul></div></div></div></div></div></header>
      <div class="fr-container body-wrapper">
        ${body}
      </div>
      <footer role="contentinfo" id="footer" class="fr-footer"><div class="fr-container"><div class="fr-footer__body"><div class="fr-footer__brand"><a href="#" title="république française" class="fr-logo"><span class="fr-logo__title">république<br />française</span></a></div><div class="fr-footer__content"><p class="fr-footer__content-desc">Ceci est un service de l’Etat français 🇫🇷, crée par<!-- --> <a href="https://etalab.gouv.fr" rel="noopener noreferrer" target="_blank">Etalab</a> <!-- -->(le département d’ouverture des données de la<!-- --> <a href="https://numerique.gouv.fr" rel="noopener noreferrer" target="_blank">Direction Interministérielle du Numérique</a>) et la <a href="https://entreprises.gouv.fr" rel="noopener noreferrer" target="_blank">Direction Générale des Entreprises</a> <!-- -->en 2020.</p><br/><p class="fr-footer__content-desc">Ce site permet de retrouver toutes les données publiques détenues par l’administration sur une entreprise ou une association et<!-- --> <a href="/donnees-extrait-kbis">en particulier les données contenues dans un extrait KBIS</a> ou un extrait D1.</p><ul class="fr-footer__content-list"><li class="fr-footer__content-item"><a href="https://etalab.gouv.fr" target="_blank" rel="noreferrer noopener" class="fr-footer__content-link">etalab.gouv.fr</a></li><li class="fr-footer__content-item"><a href="https://entreprises.gouv.fr" target="_blank" rel="noreferrer noopener" class="fr-footer__content-link">entreprises.gouv.fr</a></li><li class="fr-footer__content-item"><a target="_blank" rel="noreferrer noopener" href="https://entreprendre.service-public.fr/" class="fr-footer__content-link">entreprendre.service-public.fr</a></li><li class="fr-footer__content-item"><a target="_blank" rel="noreferrer noopener" href="https://mon-entreprise.fr" class="fr-footer__content-link">mon-entreprise.fr</a></li><li class="fr-footer__content-item"><a target="_blank" rel="noreferrer noopener" href="https://data.gouv.fr" class="fr-footer__content-link">data.gouv.fr</a></li></ul></div></div><div class="fr-footer__bottom"><ul class="fr-footer__bottom-list"><li class="fr-footer__bottom-item"><a href="/vie-privee" class="fr-footer__bottom-link">Vie privée &amp; cookies</a></li><li class="fr-footer__bottom-item"><a href="/mentions-legales" class="fr-footer__bottom-link">Mentions légales</a></li><li class="fr-footer__bottom-item"><a href="/accessibilite" class="fr-footer__bottom-link">Accessibilité : non conforme</a></li><li class="fr-footer__bottom-item"><a href="/faq" class="fr-footer__bottom-link">FAQ</a></li></ul><ul class="fr-footer__bottom-list"><li class="fr-footer__bottom-item"><a href="/historique-des-modifications" class="fr-footer__bottom-link">Historique des changements</a></li><li class="fr-footer__bottom-item"><a target="_blank" rel="noreferrer noopener" href="https://github.com/etalab/annuaire-entreprises-site" class="fr-footer__bottom-link">Code source</a></li><li class="fr-footer__bottom-item"><a href="/partager" class="fr-footer__bottom-link">Réutilisations &amp; partage</a></li><li class="fr-footer__bottom-item"><a href="/administration" class="fr-footer__bottom-link">Administrations partenaires</a></li><li class="fr-footer__bottom-item"></li><li class="fr-footer__bottom-item"><a href="/statistiques" class="fr-footer__bottom-link">Statistiques</a></li></ul><div class="fr-footer__bottom-copy"><p>Sauf mention contraire, tous les textes de ce site sont sous<!-- --> <a href="https://github.com/etalab/licence-ouverte/blob/master/LO.md" target="_blank" rel="noreferrer noopener">licence etalab-2.0</a></p></div></div></div></footer>
    </body>
  </html>`;
};
