import React from 'react';
import { information } from '../../components-ui/icon';
import MapOrListSwitch from '../search-bar/map-or-list';
import Logo from '../../components-ui/logo';
import { buildSearchQuery, IParams } from '../../models/search-filter-params';
import SearchBar from '../search-bar/search-bar';
import AdvancedSearchFilters from '../search-bar/advanced-search-filters';

interface IProps {
  currentSearchTerm?: string;
  map?: boolean;
  searchParams?: IParams;
  useAdvancedSearch?: boolean;
}

const HeaderWithSearch: React.FC<IProps> = ({
  currentSearchTerm = '',
  map = false,
  searchParams = {},
  useAdvancedSearch = false,
}) => (
  <header role="banner" className="fr-header">
    <form
      id="search-bar-form"
      action={map ? '/rechercher/carte' : '/rechercher'}
      method="get"
    >
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
                <SearchBar defaultValue={currentSearchTerm} />
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
      {useAdvancedSearch && (
        <div id="search-filters-container">
          <div className="fr-container">
            <AdvancedSearchFilters
              searchParams={searchParams}
              searchTerm={currentSearchTerm}
            />
            <div className="map-switch">
              <MapOrListSwitch
                isMap={map}
                query={buildSearchQuery(currentSearchTerm, searchParams)}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        div.annuaire-logo {
          order: 2;
          margin-right: 15px;
        }

        .not-fr-search {
          width: 470px;
          max-width: 100%;
          flex-grow: 1;
        }

        #search-filters-container {
          background-color: #f6f6f6;
          display: none;
        }

        #search-filters-container > .fr-container {
          display: flex;
          justify-content: start;
          align-items: center;
          flex-wrap: wrap;
        }

        .map-switch {
          flex-grow: 1;
          text-align: right;
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
    </form>
  </header>
);

export default HeaderWithSearch;
