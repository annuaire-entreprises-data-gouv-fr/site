import React from 'react';
import { information } from '#components-ui/icon';
import Logo from '#components-ui/logo';
import { PrintNever, PrintOnly } from '#components-ui/print-visibility';
import AdvancedSearch from '#components/advanced-search';
import SearchBar from '#components/search-bar';
import { IParams } from '#models/search-filter-params';

interface IProps {
  currentSearchTerm?: string;
  map?: boolean;
  searchParams?: IParams;
  useAdvancedSearch?: boolean;
}

const HeaderWithSearch: React.FC<IProps> = ({
  currentSearchTerm = '',
  searchParams = {},
  map = false,
  useAdvancedSearch = false,
}) => (
  <header role="banner" className="fr-header">
    <PrintNever>
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
                      <Logo
                        title="Logo de l’Annuaire des Entreprises"
                        slug="annuaire-entreprises"
                        width={140}
                        height={54}
                      />
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
          <AdvancedSearch
            searchParams={searchParams}
            currentSearchTerm={currentSearchTerm}
            isMap={map}
          />
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
    </PrintNever>
  </header>
);

export default HeaderWithSearch;
