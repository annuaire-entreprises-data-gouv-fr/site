import React from 'react';
import { PageContext } from '../../layouts/page-context';
import SearchBar from '../search-bar';

class HeaderSmall extends React.Component<{
  currentSearchTerm: string;
  map: boolean;
}> {
  static contextType = PageContext;

  render() {
    const { currentSearchTerm = '', map = false } = this.props;

    return (
      <>
        <header role="banner" className="fr-header">
          <div className="fr-header__body">
            <div className="fr-container">
              <div className="fr-header__body-row">
                <div className="fr-header__brand">
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
                    <div className="annuaire-logo">
                      <a href="/" title="L’Annuaire des Entreprises">
                        <div>L’Annuaire des Entreprises</div>
                      </a>
                    </div>
                    <div className="fr-header__navbar"></div>
                  </div>
                  <div className="not-fr-search">
                    <SearchBar
                      defaultValue={currentSearchTerm}
                      url={map ? '/rechercher/carte' : '/rechercher'}
                    />
                  </div>
                </div>
                <div className="fr-header__tools">
                  <div className="fr-header__tools-links">
                    <ul className="fr-links-group">
                      <li>
                        <a
                          className="fr-link fr-fi-information-line"
                          href="/comment-ca-marche"
                        >
                          À propos
                        </a>
                      </li>
                      {this.context.dirigeant && (
                        <li>
                          <a
                            className="fr-link fr-fi-account-fill"
                            href="/comment-ca-marche"
                          >
                            {this.context.dirigeant.firstName}{' '}
                            {this.context.dirigeant.name}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <style global jsx>{`
          div.annuaire-logo {
            order: 2;
          }
          div.annuaire-logo > a > div {
            max-width: 80px;
            margin: 0;
            margin-right: 30px;
            flex-grow: 0;
            font-size: 1.1rem;
            line-height: 1.4rem;
            font-family: serif;
            font-weight: bold;
            font-style: italic;
          }

          .not-fr-search {
            width: 420px;
            max-width: 100%;
            flex-grow: 1;
          }

          @media only screen and (min-width: 1px) and (max-width: 991px) {
            .not-fr-search {
              width: 100%;
              margin: 0.75rem;
              margin-top: 0;
            }
          }
          @media print {
            .fr-header {
              display: none !important;
            }
          }
        `}</style>
      </>
    );
  }
}

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
                    <a
                      className="fr-link fr-fi-information-line"
                      href="/comment-ca-marche"
                    >
                      À propos
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
      header.fr-header {
        box-shadow: none !important;
      }
    `}</style>
  </>
);

export { Header, HeaderSmall };
