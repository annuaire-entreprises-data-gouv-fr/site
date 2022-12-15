import React from 'react';
import { information } from '#components-ui/icon';
import HeaderWithSearch from '#components/header/header-with-search';

const Header = () => (
  <>
    <header role="banner" className="fr-header">
      <div className="fr-header__body">
        <div className="fr-container">
          <div className="fr-header__body-row">
            <div className="fr-header__brand fr-enlarge-link">
              <div className="fr-header__brand-top">
                <div className="fr-header__logo">
                  <a href="/" title="République française">
                    <p className="fr-logo">
                      République
                      <br />
                      française
                    </p>
                  </a>
                </div>
                <div className="fr-header__navbar"></div>
              </div>
            </div>
            <div className="fr-header__tools">
              <div className="fr-header__tools-links">
                <ul className="fr-links-group">
                  <li>
                    <a className="fr-link" href="/comment-ca-marche">
                      {information} À propos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    <style jsx>{`
      header.fr-header,
      div.fr-header__brand {
        background-color: transparent !important;
      }
    `}</style>
  </>
);

export { Header, HeaderWithSearch };
