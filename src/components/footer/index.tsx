import { clsx } from "clsx";
import { Link } from "#/components/Link";
import Logo from "#/components-ui/logo";
import { PrintNever } from "#/components-ui/print-visibility";
import { administrationsMetaData } from "#/models/administrations";
import { getAllLandingPages } from "#/models/landing-pages";
import { getBaseUrl } from "#/utils/server-side-helper/get-base-url";
import styles from "./style.module.css";

const Footer = () => (
  <PrintNever>
    <footer className="fr-footer" id="footer">
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
                      <Link
                        className="fr-footer__top-link"
                        params={{ slug }}
                        to="/lp/$slug"
                      >
                        {footerLabel}
                      </Link>
                    </li>
                  ))}
              </ul>
              <br />
              <strong className="fr-footer__top-cat">
                Vérifier les informations légales d'une administration
              </strong>
              <ul className="fr-footer__top-list">
                {getAllLandingPages()
                  .filter((lp) => lp.isServicePublic)
                  .map(({ slug, footerLabel }) => (
                    <li key={slug}>
                      <Link
                        className="fr-footer__top-link"
                        params={{ slug }}
                        to="/lp/$slug"
                      >
                        {footerLabel}
                      </Link>
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
                    href={`${getBaseUrl()}/departements/index.html`}
                  >
                    Entreprises françaises par département
                  </a>
                </li>
              </ul>
              <br />
              <strong className="fr-footer__top-cat">Répertoire Sirene</strong>
              <ul className="fr-footer__top-list">
                <li>
                  <Link className="fr-footer__top-link" to="/export-sirene">
                    Générer une liste d'établissements (SIRET) au format CSV
                  </Link>
                </li>
              </ul>
            </div>
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <strong className="fr-footer__top-cat">
                Développeurs & développeuses
              </strong>
              <ul className="fr-footer__top-list">
                <li>
                  <Link className="fr-footer__top-link" to="/partager">
                    Réutiliser & partager
                  </Link>
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
                  <Link className="fr-footer__top-link" to="/donnees/sources">
                    Sources de données
                  </Link>
                </li>
                <li>
                  <Link
                    className="fr-footer__top-link"
                    to="/donnees/api-entreprises"
                  >
                    API Recherche d'entreprises & API Entreprise
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/donnees/api">
                    Disponibilité des API
                  </Link>
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
                    href="https://entreprendre.service-public.gouv.fr/"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    entreprendre.service-public.gouv.fr
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
                    href="https://conseillers-entreprises.service-public.gouv.fr"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    conseillers-entreprises.service-public.gouv.fr
                  </a>
                </li>
              </ul>
            </div>
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <strong className="fr-footer__top-cat">Aide</strong>
              <ul className="fr-footer__top-list">
                <li>
                  <Link className="fr-footer__top-link" to="/faq">
                    Questions fréquentes
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/definitions">
                    Définitions
                  </Link>
                </li>
                <li>
                  <Link
                    className="fr-footer__top-link"
                    to="/formulaire/supprimer-donnees-personnelles-entreprise"
                  >
                    Supprimer ses données personnelles
                  </Link>
                </li>
              </ul>
              <br />
              <strong className="fr-footer__top-cat">
                L'Annuaire des Entreprises
              </strong>
              <ul className="fr-footer__top-list">
                <li>
                  <Link
                    className="fr-footer__top-link"
                    to="/a-propos/comment-ca-marche"
                  >
                    À propos
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/administration">
                    Administrations partenaires
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/lp/agent-public">
                    L'espace agent public
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/a-propos/stats">
                    Statistiques d'usage
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/a-propos/budget">
                    Budget
                  </Link>
                </li>
                <li>
                  <Link className="fr-footer__top-link" to="/a-propos/equipe">
                    Équipe
                  </Link>
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
            <Link
              className={clsx("fr-footer__brand-link", styles.brandLinkItem)}
              title="Aller à l'accueil du site - annuaire-entreprises.data.gouv.fr - République Française"
              to="/"
            >
              <img
                alt="logo data.gouv.fr"
                className="inline h-12 -translate-y-[15%]"
                height={64}
                src="/images/logos/data-gouv.svg"
                width={64}
              />
              <p>Produit de l'écosystème datagouv</p>
            </Link>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              Ce site permet de retrouver toutes les données publiques détenues
              par l'administration sur une entreprise, une association ou une
              administration et{" "}
              <Link to="/a-propos/donnees-extrait-kbis">
                en particulier les données contenues dans un extrait KBIS
              </Link>{" "}
              ou de l'extrait D1.
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
                  href="https://service-public.gouv.fr"
                  rel="noopener external"
                  target="_blank"
                  title="Service Public - nouvelle fenêtre"
                >
                  service-public.gouv.fr
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
                      <Link
                        className="fr-footer__partners-link"
                        params={{ slug }}
                        to="/administration/$slug"
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
                      </Link>
                    </li>
                  ))}
                <li key="all">
                  <Link
                    className="fr-footer__partners-link"
                    to="/administration"
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
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="fr-footer__bottom">
          <ul className="fr-footer__bottom-list">
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" to="/vie-privee">
                Vie privée & cookies
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" to="/mentions-legales">
                Mentions légales
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                className="fr-footer__bottom-link"
                to="/modalites-utilisation"
              >
                Modalités d'Utilisation
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link className="fr-footer__bottom-link" to="/accessibilite">
                Accessibilité : non conforme
              </Link>
            </li>
            <li className="fr-footer__bottom-item">
              <Link
                className="fr-footer__bottom-link"
                to="/historique-des-modifications"
              >
                Historique des changements
              </Link>
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
