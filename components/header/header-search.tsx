import React from 'react';
import { SearchField } from '../search-bar';
import AdvancedSearchFields from '../search-bar/advanced-search-fields';

const HeaderSearch = ({
  currentSearchTerm = '',
  map = false,
  searchParams = null,
}) => (
  <header role="banner" className="fr-header">
    <form action={map ? '/rechercher/carte' : '/rechercher'} method="get">
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
                <SearchField defaultValue={currentSearchTerm} />

                <div className="show-advanced layout-right">
                  <label
                    className="button-toggle-advanced-search"
                    htmlFor="toggle-advanced-search"
                  >
                    {`>> recherche avancée`}
                  </label>
                </div>
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
      <div className="fr-container">
        <input
          className="toggle-advanced-search"
          id="toggle-advanced-search"
          type="checkbox"
          defaultChecked={!!searchParams}
        />
        <div className="fields">
          <AdvancedSearchFields searchParams={searchParams} />
        </div>
      </div>
    </form>

    <style global jsx>{`
      .show-advanced {
        font-style: italic;
        font-size: 0.9rem;
        text-decoration: underline;
      }
      .show-advanced > label {
        cursor: pointer;
      }

      .toggle-advanced-search {
        display: none;
      }

      div.fields {
        max-height: 0;
        overflow-x: hidden;
        transition: max-height 300ms ease-in-out;
        padding: 0 10px;
      }

      .toggle-advanced-search:checked ~ .fields {
        max-height: 1000px;
      }

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
  </header>
);

export default HeaderSearch;
