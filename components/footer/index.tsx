import Logo from '#components-ui/logo';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import { administrationsMetaData } from '#models/administrations';
import { getAllLandingPages } from '#models/landing-pages';

const Footer = () => (
  <PrintNever>
    <footer className="fr-footer" role="contentinfo" id="footer">
      <div className="fr-footer__top">
        <div className="fr-container">
          <div className="fr-grid-row fr-grid-row--start fr-grid-row--gutters">
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <b className="fr-footer__top-cat">
                Vérifier les informations légales d’une entreprise ou
                association
              </b>
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
              <b className="fr-footer__top-cat">
                Vérifier les informations légales d’une administration
              </b>
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
            </div>
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <b className="fr-footer__top-cat">
                Consulter la liste officielle des entreprises françaises
              </b>
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
              <b className="fr-footer__top-cat">Aide</b>
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
                  <a className="fr-footer__top-link" href="/partager">
                    Réutiliser & partager
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/donnees/sources">
                    Sources de données
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/donnees/api">
                    Statut des API utilisées
                  </a>
                </li>
              </ul>
            </div>
            <div className="fr-col-12 fr-col-sm-4 fr-col-md-4">
              <b className="fr-footer__top-cat">Annuaire des Entreprises</b>
              <ul className="fr-footer__top-list">
                <li>
                  <a className="fr-footer__top-link" href="/administration">
                    Administrations partenaires
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/stats">
                    Statistiques
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/budget">
                    Budget
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/equipe">
                    Qui sommes-nous ?
                  </a>
                </li>
                <li>
                  <a className="fr-footer__top-link" href="/comment-ca-marche">
                    A propos
                  </a>
                </li>
                <li>
                  <a
                    className="fr-footer__top-link"
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://github.com/etalab/annuaire-entreprises-site"
                  >
                    Code source
                  </a>
                </li>
                <li>
                  <a
                    className="fr-footer__top-link"
                    href="/connexion/agent-public"
                  >
                    Espace agent public{' '}
                    <Tag color="new" size="small">
                      beta
                    </Tag>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="fr-container">
        <div className="fr-footer__body">
          <div className="fr-footer__brand">
            <a className="fr-logo" href="#" title="république française">
              <span className="fr-logo__title">
                république
                <br />
                française
              </span>
            </a>
          </div>
          <div className="fr-footer__content">
            <p className="fr-footer__content-desc">
              Ce site permet de retrouver toutes les données publiques détenues
              par l’administration sur une entreprise, une association ou une
              administration et{' '}
              <a href="/donnees-extrait-kbis">
                en particulier les données contenues dans un extrait KBIS
              </a>{' '}
              ou de l’extrait D1.
            </p>
            <p className="fr-footer__content-desc">
              Il est opéré par la{' '}
              <a
                href="https://numerique.gouv.fr"
                rel="noopener noreferrer"
                target="_blank"
              >
                Direction Interministérielle du Numérique
              </a>
              &nbsp;et la&nbsp;
              <a
                href="https://entreprises.gouv.fr"
                rel="noopener noreferrer"
                target="_blank"
              >
                Direction Générale des Entreprises
              </a>
              .
            </p>
            <br />
            <ul className="fr-footer__content-list">
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  href="https://entreprises.gouv.fr"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  entreprises.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://entreprendre.service-public.fr/"
                >
                  entreprendre.service-public.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://mon-entreprise.fr"
                >
                  mon-entreprise.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://data.gouv.fr"
                >
                  data.gouv.fr
                </a>
              </li>
              <li className="fr-footer__content-item">
                <a
                  className="fr-footer__content-link"
                  target="_blank"
                  rel="noreferrer noopener"
                  href="https://formalites.entreprises.gouv.fr"
                >
                  formalites.entreprises.gouv.fr
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="fr-footer__partners">
          <b className="fr-footer__partners-title">Nos partenaires</b>
          <div className="fr-footer__partners-logos">
            <div className="fr-footer__partners-sub">
              <ul>
                {Object.values(administrationsMetaData)
                  .filter(({ logoType }) => !!logoType)
                  .map(({ slug, logoType, long }) => (
                    <li key={long}>
                      <a
                        className="fr-footer__partners-link"
                        href={`/administration#${slug}`}
                      >
                        {logoType === 'portrait' ? (
                          <Logo
                            title={long}
                            slug={slug}
                            width={80}
                            height={50}
                            className="fr-footer__logo"
                          />
                        ) : (
                          <Logo
                            title={long}
                            slug={slug}
                            width={150}
                            height={50}
                            className="fr-footer__logo"
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
                      title={[
                        'Ainsi que : ',
                        ...Object.values(administrationsMetaData)
                          .filter(({ logoType }) => !logoType)
                          .map(({ long }) => long),
                      ].join('\r\n')}
                      slug="rf"
                      width={80}
                      height={50}
                      className="fr-footer__logo"
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
          </ul>
          <div className="fr-footer__bottom-copy">
            <p>
              Sauf mention contraire, tous les textes de ce site sont sous{' '}
              <a
                href="https://github.com/etalab/licence-ouverte/blob/master/LO.md"
                target="_blank"
                rel="noreferrer noopener"
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
