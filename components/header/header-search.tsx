import React from 'react';
import { information } from '../../components-ui/icon';
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
                      <svg
                        width="98"
                        height="80"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.7 21v-.3l1.5-.7v-9.3l-1.5-.6v-.3h5.7v.3l-1.6.6v9.4h3.7l1.4-3.2h.2V21H2.7Zm10.4-8v-.5l1-.6c.3-.3.4-.6.4-.8 0-.5-.3-.8-.8-1.1l-.6-.3v-.2l.5-1c.1-.2.2-.3.4-.3l.4.2 1 .8.3 1c0 .4-.1.7-.3 1a3 3 0 0 1-.8 1 4 4 0 0 1-1.5.7Zm2.2 8v-.3l1-.6 4.4-10.4h1.5L26.6 20l1.2.6v.3h-5.4v-.3l1.5-.6-1.2-2.8h-4L17.6 20l1.4.6v.3h-3.7Zm3.8-4.6h3.2l-1.6-4-1.6 4Zm9.5 4.6v-.3l1.2-.5V15l-1.1-.7v-.2l3-1h.3l.1 1.2h.1l1.2-.9c.4-.2.9-.3 1.4-.3.7 0 1.2.2 1.7.5.4.4.6.9.6 1.6v5l1.2.5v.3h-4.4v-.3l.8-.5v-4.3c0-.4 0-.7-.3-1-.3-.2-.5-.3-.9-.3-.2 0-.5 0-.7.2-.3 0-.5.2-.6.3v5l.8.6v.3h-4.4Zm10.5 0v-.3l1.2-.5V15l-1.1-.7v-.2l3-1h.3l.2 1.2 1.2-.9c.4-.2.9-.3 1.4-.3.7 0 1.2.2 1.7.5.4.4.6.9.6 1.6v5l1.2.5v.3h-4.4v-.3l.8-.5v-4.3c0-.4 0-.7-.3-1-.2-.2-.5-.3-.9-.3-.2 0-.4 0-.7.2-.3 0-.5.2-.6.3v5l.8.6v.3h-4.4Zm13.7.2c-.6 0-1.2-.2-1.6-.6-.5-.3-.7-.8-.7-1.5v-5l-1.1-.6v-.3h3.5v5.2c0 .4.1.7.3.9.3.2.6.3 1 .3a2.2 2.2 0 0 0 1.2-.4V14l-1-.6v-.3h3.4v7l1 .5v.3h-3.4v-1l-1.2.8c-.4.3-.8.4-1.4.4Zm9 0c-.6 0-1.1-.2-1.5-.5-.4-.4-.6-.9-.6-1.5 0-.4.1-.8.3-1 .1-.3.4-.6.8-.8l1.7-.6 1.6-.4v-1a1.4 1.4 0 0 0-1.4-1.4c-.4 0-.6 0-.8.2-.2.1-.2.4-.2.7v.8H60v-.5c0-.2 0-.5.2-.7l.8-.7a4 4 0 0 1 2.3-.7c.6 0 1 0 1.5.2.5.1.9.4 1.1.7.3.3.5.7.5 1.3v4.4c.2.2.4.3.8.3h.5v.3l-.6.6c-.3.2-.7.3-1.2.3-.4 0-.8-.1-1.1-.3a2 2 0 0 1-.7-.9H64a4 4 0 0 1-1 .8c-.4.2-.9.4-1.4.4Zm.2-2.5c0 .4 0 .7.3.8.2.2.5.3.8.3.3 0 .6 0 1-.2V17l-1.3.4c-.3.1-.5.3-.6.5-.2.2-.2.4-.2.7Zm8.7-7.3-.9-.3c-.2-.3-.3-.6-.3-1A1.2 1.2 0 0 1 70.7 9c.4 0 .7.1 1 .4.2.2.3.5.3.9 0 .3-.1.6-.4.9-.2.2-.5.3-.9.3ZM68.5 21v-.3l1-.5V15l-1-.8V14l3.3-1h.2v7.2l1 .5v.3h-4.5Zm5.6 0v-.3l1.1-.5v-5l-1-.9v-.2l3-1h.3l.1 1.5h.1l.7-1a1.6 1.6 0 0 1 1.3-.5h.3l.3.1c.3.1.5.3.5.5v.3l-.5 1h-.5c-.3-.2-.6-.2-1-.2s-.8.2-1.2.6v4.8l1.4.5v.3h-4.9Zm11 .2c-1 0-2-.4-2.7-1-.6-.7-1-1.6-1-2.7 0-.9.2-1.6.6-2.3a4.1 4.1 0 0 1 3.6-2.1c1 0 1.7.3 2.2.9.5.6.7 1.5.7 2.6h-4.8v.2c0 .4.1.9.3 1.3.2.4.5.7.8.9a4.6 4.6 0 0 0 3.7-.2v.3a3.7 3.7 0 0 1-3.3 2Zm.1-7.4c-.4 0-.7.2-1 .6-.2.3-.4.9-.4 1.5h2.8c0-.8-.2-1.3-.5-1.6-.2-.3-.5-.5-.9-.5ZM5.4 45.2c-.5 0-1-.2-1.4-.5-.4-.2-.8-.6-1-1.2-.3-.5-.5-1.1-.5-1.8 0-1 .2-1.8.6-2.5.3-.7.8-1.2 1.4-1.6.6-.3 1.3-.5 2-.5l1.5.1v-3l-1.2-.8v-.2l3.3-1h.2v12l1.2.5v.3H8.1l-.1-.9h-.1l-1.2.8c-.4.2-.8.3-1.3.3Zm-.5-4c0 .9.2 1.5.6 2a1.7 1.7 0 0 0 1.9.5c.2 0 .3-.2.5-.3v-4.9l-.5-.4-.6-.1c-.3 0-.6 0-1 .3-.2.1-.4.5-.6 1-.2.4-.3 1-.3 1.9Zm11.4 4c-1.1 0-2-.4-2.7-1-.7-.7-1-1.6-1-2.7a4.1 4.1 0 0 1 4.2-4.4c.9 0 1.6.3 2.1.9.5.6.8 1.5.8 2.6h-4.8v.2c0 .4 0 .9.2 1.3s.5.7.9.9c.4.2.9.3 1.5.3a4.6 4.6 0 0 0 2.1-.5h.1v.3a3.7 3.7 0 0 1-3.4 2Zm0-7.4c-.3 0-.7.2-1 .6-.2.3-.3.9-.4 1.5h2.9c-.1-.8-.3-1.3-.5-1.6-.3-.3-.6-.5-1-.5Zm7.6 7.4a5.6 5.6 0 0 1-2.7-.6v-2h.3l.6.9c.4.6 1 1 1.7 1 1 0 1.4-.4 1.4-1l-.2-.6-.6-.4-1.2-.6c-.6-.2-1-.5-1.4-.9a2 2 0 0 1-.5-1.3c0-.5.2-1 .4-1.3l1-1c.5-.2 1-.3 1.6-.3a5.2 5.2 0 0 1 2.2.5v2h-.3l-.5-.8c-.2-.3-.4-.6-.7-.7-.2-.2-.5-.3-.8-.3-.3 0-.6.1-.8.3-.2.2-.3.4-.3.7l.1.5.5.4 1.1.5 1 .5c.3.1.5.4.7.7.2.3.4.7.4 1.2s-.2 1-.5 1.4c-.3.4-.6.7-1 .9l-1.5.3ZM2.7 69v-.3l1.5-.7v-9.3l-1.5-.6v-.3H12v3h-.3l-1.2-2H6.8v4h2.6l1-1.5h.2V65h-.3l-1-1.4H6.9V68h4l1.4-2.6h.3V69H2.7Zm11.4 0v-.3l1.1-.5V63l-1-.7v-.2l3-1h.2l.2 1.2 1.3-.9c.4-.2.8-.3 1.3-.3.7 0 1.3.2 1.7.5.5.4.7.9.7 1.6v5l1.1.5v.3h-4.4v-.3l.9-.5v-4.3c0-.4-.1-.7-.4-1-.2-.2-.5-.3-.8-.3-.3 0-.5 0-.8.2l-.6.3v5l.9.6v.3H14Zm13.7.2a3 3 0 0 1-1.7-.5c-.4-.3-.6-.7-.6-1.2V62h-1.2v-.2l1.5-.6 1.7-1.8h.4v1.8h2.3v.8H28v5c0 .4 0 .6.3.7l1 .2a4 4 0 0 0 1-.1v.3c-.2.3-.5.5-1 .7-.3.3-.8.4-1.4.4Zm3.5-.2v-.3l1-.5v-5l-1-.9v-.2l3.1-1h.2l.2 1.5.8-1a1.6 1.6 0 0 1 1.2-.5h.3l.4.1c.3.1.5.3.5.5l-.1.3-.4 1h-.6c-.3-.2-.6-.2-.9-.2-.5 0-.9.2-1.2.6v4.8l1.4.5v.3h-5Zm11 .2c-1.1 0-2-.4-2.7-1-.7-.7-1-1.6-1-2.7 0-.9.2-1.6.5-2.3a4.1 4.1 0 0 1 3.7-2.1c.9 0 1.6.3 2.1.9.5.6.8 1.5.8 2.6h-4.8v.2c0 .4 0 .9.2 1.3s.5.7.9.9c.4.2.9.3 1.5.3a4.6 4.6 0 0 0 2.2-.5v.3a3.7 3.7 0 0 1-3.4 2Zm0-7.4c-.3 0-.6.2-1 .6-.2.3-.3.9-.4 1.5h2.9c0-.8-.3-1.3-.5-1.6-.2-.3-.5-.5-1-.5ZM47 73v-.3l1.1-.5v-9l-1-.8v-.2l3-1h.2l.2 1 1.3-.8 1.3-.2c.5 0 1 .1 1.3.4.5.3.8.8 1.1 1.3.3.6.4 1.2.4 2 0 1-.2 1.7-.5 2.3a4 4 0 0 1-3.4 2H51l-.7-.1v3l1.3.6v.3H47Zm4.6-10.4a2 2 0 0 0-.5 0l-.6.3v5c.3.3.8.5 1.3.5.3 0 .6-.1.8-.3.3-.1.5-.4.7-.9l.2-1.8c0-1-.2-1.7-.6-2.1-.3-.5-.8-.7-1.3-.7ZM57 69v-.3l1.2-.5v-5l-1.1-.9v-.2l3-1h.3l.1 1.5h.1l.7-1a1.6 1.6 0 0 1 1.3-.5h.3l.3.1c.4.1.5.3.5.5v.3l-.4 1H62.6c-.3-.2-.6-.2-1-.2s-.8.2-1.1.6v4.8l1.3.5v.3H57Zm9.5-9.6-.9-.3c-.2-.3-.3-.6-.3-1a1.2 1.2 0 0 1 1.2-1.2c.4 0 .7.1 1 .4.2.2.3.5.3.9 0 .3-.1.6-.4.9-.2.2-.5.3-.9.3ZM64.2 69v-.3l1-.5V63l-1-.8V62l3.3-1h.2v7.2l1 .5v.3h-4.5Zm8.6.2a5.6 5.6 0 0 1-2.7-.6v-2h.3l.6.9c.4.6 1 1 1.7 1 1 0 1.4-.4 1.4-1l-.2-.6-.6-.5c-.3 0-.7-.3-1.2-.5-.6-.2-1-.5-1.4-.9a2 2 0 0 1-.4-1.3c0-.5 0-1 .3-1.3l1-1c.5-.2 1-.3 1.6-.3a5.2 5.2 0 0 1 2.2.5v2H75l-.5-.8c-.2-.3-.4-.6-.7-.7-.2-.2-.5-.3-.8-.3-.3 0-.6.1-.8.3-.2.2-.3.4-.3.7l.1.5c.1.2.3.3.6.4l1 .5 1 .5c.3.1.5.4.7.7.3.3.4.7.4 1.2s-.2 1-.5 1.4c-.2.4-.6.7-1 .9l-1.5.3Zm8.3 0c-1.2 0-2.1-.4-2.8-1-.6-.7-1-1.6-1-2.7 0-.9.2-1.6.6-2.3a4.1 4.1 0 0 1 3.6-2.1c1 0 1.7.3 2.2.9.5.6.7 1.5.7 2.6h-4.8v.2c0 .4.1.9.3 1.3.2.4.5.7.8.9a4.6 4.6 0 0 0 3.7-.2v.3a3.7 3.7 0 0 1-3.3 2Zm0-7.4c-.4 0-.7.2-1 .6-.2.3-.4.9-.4 1.5h2.8c0-.8-.2-1.3-.5-1.6-.2-.3-.5-.5-.9-.5Zm7.6 7.4a5.6 5.6 0 0 1-2.7-.6v-2h.2l.6.9c.5.6 1 1 1.8 1 .9 0 1.3-.4 1.3-1 0-.3 0-.5-.2-.6 0-.2-.3-.3-.6-.5-.3 0-.6-.3-1.1-.5-.7-.2-1.1-.5-1.4-.9a2 2 0 0 1-.5-1.3c0-.5.1-1 .4-1.3.2-.4.6-.7 1-1l1.5-.3a5.2 5.2 0 0 1 2.2.5v2H91l-.5-.8-.7-.7c-.2-.2-.5-.3-.8-.3-.4 0-.6.1-.8.3-.3.2-.4.4-.4.7 0 .2 0 .4.2.5 0 .2.3.3.5.4l1 .5 1 .5c.3.1.6.4.8.7.2.3.3.7.3 1.2s-.1 1-.4 1.4c-.3.4-.7.7-1.1.9l-1.4.3Z"
                          fill="#000"
                        />
                      </svg>
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
          padding: 0;
          display: none;
        }

        .toggle-advanced-search:checked ~ .fields {
          display: block;
        }

        div.annuaire-logo {
          order: 2;
        }
        div.annuaire-logo > a > svg {
          margin: 0;
          margin-right: 15px;
          flex-grow: 0;
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
