import React from 'react';
import Logo from '../../components-ui/logo';
import { administrationsMetaData } from '../../models/administrations';

const Footer = () => (
  <footer className="fr-footer" role="contentinfo" id="footer">
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
            Ceci est un service de l’Etat français 🇫🇷, crée par{' '}
            <a
              href="https://etalab.gouv.fr"
              rel="noopener noreferrer"
              target="_blank"
            >
              Etalab
            </a>{' '}
            (le département d’ouverture des données de la{' '}
            <a
              href="https://numerique.gouv.fr"
              rel="noopener noreferrer"
              target="_blank"
            >
              Direction Interministérielle du Numérique
            </a>
            )&nbsp;et la&nbsp;
            <a
              href="https://entreprises.gouv.fr"
              rel="noopener noreferrer"
              target="_blank"
            >
              Direction Générale des Entreprises
            </a>{' '}
            en 2020.
          </p>
          <br />
          <p className="fr-footer__content-desc">
            Ce site permet de retrouver toutes les données publiques détenues
            par l’administration sur une entreprise, une association ou une
            administration et{' '}
            <a href="/donnees-extrait-kbis">
              en particulier les données contenues dans un extrait KBIS/D1
            </a>
            .
          </p>
          <ul className="fr-footer__content-list">
            <li className="fr-footer__content-item">
              <a
                className="fr-footer__content-link"
                href="https://etalab.gouv.fr"
                target="_blank"
                rel="noreferrer noopener"
              >
                etalab.gouv.fr
              </a>
            </li>
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
          </ul>
        </div>
      </div>
      <div className="fr-footer__partners">
        <h4 className="fr-footer__partners-title">Nos partenaires</h4>
        <div className="fr-footer__partners-logos">
          <div className="fr-footer__partners-sub">
            <ul>
              {Object.values(administrationsMetaData).map(
                ({ slug, logoType, long, site }) =>
                  logoType && (
                    <li>
                      <a className="fr-footer__partners-link" href={site}>
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
                  )
              )}
            </ul>
          </div>
        </div>
      </div>
      <div className="fr-footer__bottom">
        <ul className="fr-footer__bottom-list">
          <li className="fr-footer__bottom-item">
            <a
              className="fr-footer__bottom-link"
              target="_blank"
              rel="noreferrer noopener"
              href="https://github.com/etalab/annuaire-entreprises-site"
            >
              Code source
            </a>
          </li>
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
        <ul className="fr-footer__bottom-list">
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/faq">
              FAQ
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/partager">
              Réutilisations & partage
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a
              className="fr-footer__bottom-link"
              href="/departements/index.html"
            >
              Personnes morales par départements
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/administration">
              Administrations partenaires
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/sources-de-donnees">
              Sources de données & statut des API
            </a>
          </li>
          <li className="fr-footer__bottom-item">
            <a className="fr-footer__bottom-link" href="/statistiques">
              Statistiques
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
    <style jsx>{`
      @media print {
        .fr-footer {
          display: none !important;
        }
      }
    `}</style>
  </footer>
);

export default Footer;
