import React from 'react';

const Footer = () => (
  <footer className="rf-footer" role="contentinfo" id="footer">
    <div className="rf-container">
      <div className="rf-footer__body">
        <div className="rf-footer__brand">
          <a className="rf-logo" href="#" title="république française">
            <span className="rf-logo__title">
              république
              <br />
              française
            </span>
          </a>
        </div>
        <div className="rf-footer__content">
          <p className="rf-footer__content-desc">
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
          <ul className="rf-footer__content-list">
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                href="https://etalab.gouv.fr"
                target="blank"
                rel="noreferrer noopener"
              >
                etalab.gouv.fr
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                href="https://entreprises.gouv.fr"
                target="blank"
                rel="noreferrer noopener"
              >
                entreprises.gouv.fr
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                target="blank"
                rel="noreferrer noopener"
                href="https://service-public.fr"
              >
                service-public.fr
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                target="blank"
                rel="noreferrer noopener"
                href="https://mon-entreprise.fr"
              >
                mon-entreprise.fr
              </a>
            </li>
            <li className="rf-footer__content-item">
              <a
                className="rf-footer__content-link"
                target="blank"
                rel="noreferrer noopener"
                href="https://data.gouv.fr"
              >
                data.gouv.fr
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="rf-footer__bottom">
        <ul className="rf-footer__bottom-list">
          <li className="rf-footer__bottom-item">
            <a
              className="rf-footer__bottom-link"
              target="blank"
              rel="noreferrer noopener"
              href="https://github.com/etalab/annuaire-entreprises.data.gouv.fr"
            >
              Code source
            </a>
          </li>
          <li className="rf-footer__bottom-item">
            <a className="rf-footer__bottom-link" href="/vie-privee">
              Vie privée & cookies
            </a>
          </li>
          <li className="rf-footer__bottom-item">
            <a
              className="rf-footer__bottom-link"
              href="https://www.notion.so/7c6f3a06b4444a328201c2f6aea9f27f?v=331f2aaec05f44df9b3d7fd286c956a5"
            >
              Historique des modifications
            </a>
          </li>
          {/* <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Accessibilité: partiellement conforme
              </a>
            </li> */}
          {/* <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Mentions légales
              </a>
            </li>
            <li className="rf-footer__bottom-item">
              <a className="rf-footer__bottom-link" href="#">
                Gestion des cookies
              </a>
            </li> */}
        </ul>
        <div className="rf-footer__bottom-copy">
          © République Française 2020
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
