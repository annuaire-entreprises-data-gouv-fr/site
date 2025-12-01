import { clsx } from "clsx";
import Logo from "#components-ui/logo";
import { PrintNever } from "#components-ui/print-visibility";
import { administrationsMetaData } from "#models/administrations";
import { getAllLandingPages } from "#models/landing-pages";
import styles from "./style.module.css";

const Footer = () => (
  <PrintNever>
    <footer className="fr-footer" id="footer" role="contentinfo">
      <div className="fr-footer__top">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <strong className="fr-footer__top-cat">
                Vérifier les informations légales d’une entreprise ou
                association
              </strong>
              <ul className="fr-footer__top-list">
                {getAllLandingPages()
                  .filter((lp) => !lp.isServicePublic)
                  .map(({ slug, footerLabel }) => (
                    <li key={slug}>
                      <a className="fr-footer__top-link" href={`/lp/${slug}`}>
                        {footerLabel}
                      </a>
                    </li>
                  ))}
              </ul>
              <br />
              <strong className="fr-footer__top-cat">
                Vérifier les informations légales d’une administration
              </strong>
              <ul className="fr-footer__top-list">
                {getAllLandingPages()
                  .filter((lp) => lp.isServicePublic)
                  .map(({ slug, footerLabel }) => (
                    <li key={slug}>
                      <a className="fr-footer__top-link" href={`/lp/${slug}`}>
                        {footerLabel}
                      </a>
                    </li>
                  ))}
              </ul>
              <br />
              <strong className="fr-footer__top-cat">
                Consulter la liste officielle des entreprises françaises
              </strong>
              <ul className="fr-footer__top-list">
                <li>
                  <a
                    className="fr-footer__top-link"
                    href="/departements/index.html"
                  >
                    Entreprises françaises par département
                  </a>
                </li>
              </ul>
              <br />
              <strong className="fr-footer__top-cat">Répertoire Sirene</strong>
              <ul className="fr-footer__top-list">
                <li>
                  <a className="fr-footer__top-link" href="/export-sirene">
                    Générer une liste d’établissements (SIRET) au format CSV
                  </a>
                </li>
              </ul>
            </div>
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <strong className="fr-footer__top-cat">
                Développeurs & développeuses
              </strong>
              <ul className="fr-footer__top-list">
                <li>
                  <a className="fr-footer__top-link" href="/partager">
                    Réutiliser & partager
                  </a>
                </li>
                <li>
                  <a
                    className="fr-footer__top-link"
                    href="https://github.com/annuaire-entreprises-data-gouv-fr"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Code source
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/donnees/sources">
                    Sources de données
                  </a>
                </li>
                <li>
                  <a
                    className="fr-footer__top-link"
                    href="/donnees/api-entreprises"
                  >
                    API Recherche d’entreprises & API Entreprise
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/donnees/api">
                    Disponibilité des API
                  </a>
                </li>
              </ul>
              <br />
              <ul className="fr-footer__top-list">
                <strong className="fr-footer__top-cat">Autres sites</strong>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__top-link"
                    href="https://entreprises.gouv.fr"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    entreprises.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__top-link"
                    href="https://entreprendre.service-public.fr/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    entreprendre.service-public.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__top-link"
                    href="https://mon-entreprise.urssaf.fr/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    mon-entreprise.urssaf.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__top-link"
                    href="https://formalites.entreprises.gouv.fr"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    formalites.entreprises.gouv.fr
                  </a>
                </li>
                <li className="fr-footer__content-item">
                  <a
                    className="fr-footer__top-link"
                    href="https://conseillers-entreprises.service-public.fr"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    conseillers-entreprises.service-public.fr
                  </a>
                </li>
              </ul>
            </div>
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <strong className="fr-footer__top-cat">Aide</strong>
              <ul className="fr-footer__top-list">
                <li>
                  <a className="fr-footer__top-link" href="/faq">
                    Questions fréquentes
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/definitions">
                    Définitions
                  </a>
                </li>
                <li>
                  <a
                    className="fr-footer__top-link"
                    href="/formulaire/supprimer-donnees-personnelles-entreprise"
                  >
                    Supprimer ses données personnelles
                  </a>
                </li>
              </ul>
              <br />
              <strong className="fr-footer__top-cat">
                L’Annuaire des Entreprises
              </strong>
              <ul className="fr-footer__top-list">
                <li>
                  <a
                    className="fr-footer__top-link"
                    href="/a-propos/comment-ca-marche"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/administration">
                    Administrations partenaires
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/lp/agent-public">
                    L’espace agent public
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/a-propos/stats">
                    Statistiques d’usage
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/a-propos/budget">
                    Budget
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/a-propos/equipe">
                    Équipe
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand fr-enlarge-link">
            <p className="fr-logo" title="république française">
              <span className="fr-logo__title">
                république
                <br />
                française
              </span>
            </p>
            <a
              className={clsx("fr-footer__brand-link", styles.brandLinkItem)}
              href="#"
              title="Aller à l'accueil du site - annuaire-entreprises.data.gouv.fr - République Française"
            >
              <img
                alt="logo data.gouv.fr"
                className="inline -translate-y-[15%] h-12"
                height={64}
                src="/images/logos/data-gouv.svg"
                width={64}
              />
              <p>Produit de l'écosystème datagouv</p>
            </a>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              Ce site permet de retrouver toutes les données publiques détenues
              par l’administration sur une entreprise, une association ou une
              administration et{" "}
              <a href="/a-propos/donnees-extrait-kbis">
                en particulier les données contenues dans un extrait KBIS
              </a>{" "}
              ou de l’extrait D1.
            </p>
            <p className="fr-footer__content-desc">
              Il est opéré par la{" "}
              <a
                href="https://numerique.gouv.fr"
                rel="noopener noreferrer"
                target="_blank"
              >
                Direction Interministérielle du Numérique
              </a>
              .
            </p>
            <br />
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://legifrance.gouv.fr"
                  rel="noopener external"
                  target="_blank"
                  title="Legifrance - nouvelle fenêtre"
                >
                  legifrance.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://info.gouv.fr"
                  rel="noopener external"
                  target="_blank"
                  title="Info.gouv.fr - nouvelle fenêtre"
                >
                  info.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://service-public.fr"
                  rel="noopener external"
                  target="_blank"
                  title="Service Public - nouvelle fenêtre"
                >
                  service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://data.gouv.fr"
                  rel="noopener external"
                  target="_blank"
                  title="Data.gouv.fr - nouvelle fenêtre"
                >
                  data.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__partners">
          <strong className="fr-footer__partners-title">Nos partenaires</strong>
          <div className="fr-footer__partners-logos">
            <div className="fr-footer__partners-sub">
              <ul>
                {Object.values(administrationsMetaData)
                  .filter(({ logoType }) => !!logoType)
                  .map(({ slug, logoType, long, short }) => (
                    <li key={long}>
                      <a
                        className="fr-footer__partners-link"
                        href={`/administration#${slug}`}
                      >
                        {logoType === "portrait" ? (
                          <Logo
                            alt={short}
                            className="fr-footer__logo"
                            height={50}
                            lazy
                            slug={slug}
                            title={long}
                            width={60}
                          />
                        ) : (
                          <Logo
                            alt={short}
                            className="fr-footer__logo"
                            height={50}
                            lazy
                            slug={slug}
                            title={long}
                            width={100}
                          />
                        )}
                      </a>
                    </li>
                  ))}
                <li key="all">
                  <a
                    className="fr-footer__partners-link"
                    href="/administration"
                  >
                    <Logo
                      className="fr-footer__logo"
                      height={50}
                      lazy
                      slug="rf"
                      title={[
                        "Ainsi que : ",
                        ...Object.values(administrationsMetaData)
                          .filter(({ logoType }) => !logoType)
                          .map(({ long }) => long),
                      ].join("\r\n")}
                      width={80}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/vie-privee">
                Vie privée & cookies
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/mentions-legales">
                Mentions légales
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="/modalites-utilisation"
              >
                Modalités d’Utilisation
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a className="fr-footer__bottom-link" href="/accessibilite">
                Accessibilité : non conforme
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="/historique-des-modifications"
              >
                Historique des changements
              </a>
            </li>
            <li className="fr-footer__bottom-item">
              <a
                className="fr-footer__bottom-link"
                href="https://github.com/annuaire-entreprises-data-gouv-fr"
                rel="noreferrer noopener"
                target="_blank"
              >
                Code source
              </a>
            </li>
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les textes de ce site sont sous{" "}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                rel="noreferrer noopener"
                target="_blank"
              >
                licence etalab-2.0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </PrintNever>
);

export default Footer;
