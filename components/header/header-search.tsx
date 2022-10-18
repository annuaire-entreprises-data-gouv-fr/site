import React from 'react';
import { information } from '../../components-ui/icon';
import Logo from '../../components-ui/logo';
import SearchFilterParams, { IParams } from '../../models/search-filter-params';
import { SearchField } from '../search-bar';
import AdvancedSearchFields from '../search-bar/advanced-search-fields';

interface IProps {
  currentSearchTerm?: string;
  map?: boolean;
  searchFilterParams?: IParams;
}

const HeaderSearch: React.FC<IProps> = ({
  currentSearchTerm = '',
  map = false,
  searchFilterParams,
}) => {
  const shouldDisplayAdvancedSearch = searchFilterParams
    ? SearchFilterParams.hasParam(searchFilterParams)
    : false;

  return (
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
                      <Logo width={140} />
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
                      {`⇢ recherche avancée`}
                    </label>
                  </div>
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
            <input
              className="toggle-advanced-search"
              id="toggle-advanced-search"
              type="checkbox"
              defaultChecked={shouldDisplayAdvancedSearch}
            />
            <div className="fields">
              <AdvancedSearchFields searchFilterParams={searchFilterParams} />
            </div>
          </div>
        </div>
      </form>

      <style jsx>{`
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
          padding: 0;
          display: none;
        }

        .toggle-advanced-search:checked ~ .fields {
          display: block;
        }

        div.annuaire-logo {
          order: 2;
          margin-right: 15px;
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
};

export default HeaderSearch;
