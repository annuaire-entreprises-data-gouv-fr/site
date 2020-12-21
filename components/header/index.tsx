import React from 'react';
import SearchBar from '../searchBar';

const HeaderSmall = ({ currentSearchTerm = '', map = false }) => (
  <>
    <header className="rf-header">
      <div className="rf-container">
        <div className="rf-header__body">
          <div className="rf-header__brand">
            <a
              className="rf-logo"
              href="/"
              title="Ministère<br>de l’europe<br>et des affaires<br>étrangères"
            >
              <span className="rf-logo__title">
                République
                <br />
                française
              </span>
            </a>
          </div>
          <div className="rf-header__sub">L’Annuaire des Entreprises</div>
          <div className="not-rf-search">
            <SearchBar
              defaultValue={currentSearchTerm}
              url={map ? '/rechercher/carte' : '/rechercher'}
            />
          </div>
          <div className="rf-header__tools">
            <div className="rf-shortcuts">
              <ul className="rf-shortcuts__list">
                <li className="rf-shortcuts__item">
                  <a
                    href="/comment-ca-marche"
                    className="rf-link"
                    target="_self"
                  >
                    À propos
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>

    <style global jsx>{`
      .rf-header__brand {
        flex-grow: 0;
      }
      .not-rf-search {
        flex-grow: 1;
        height: 100%;
        margin: 5px;
      }
      .rf-header .rf-search-bar {
        margin: 0;
      }
      .rf-header__tools {
        flex-grow: 0;
      }
      div.rf-header__sub {
        max-width: 80px;
        margin: 0;
        margin-right: 15px;
        flex-grow: 0;
        font-size: 1rem;
        font-family: serif;
        font-weight: bold;
        font-style: italic;
      }

      @media only screen and (min-width: 1px) and (max-width: 500px) {
        .not-rf-search {
          flex-grow: 0;
          margin: auto;
          margin-top: 10px;
          width: calc(100% - 20px);
        }
      }
    `}</style>
  </>
);

const Header = () => (
  <>
    <header className="rf-header">
      <div className="rf-container">
        <div className="rf-header__body">
          <div className="rf-header__brand">
            <a className="rf-logo" href="#" title="République française">
              <span className="rf-logo__title">
                République
                <br />
                française
              </span>
            </a>
          </div>
          <div className="rf-header__tools">
            <div className="rf-shortcuts">
              <ul className="rf-shortcuts__list">
                <li className="rf-shortcuts__item">
                  <a
                    href="/comment-ca-marche"
                    className="rf-link"
                    target="_self"
                  >
                    À propos
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
    <style jsx>{`
      header.rf-header {
        box-shadow: none !important;
      }
    `}</style>
  </>
);

export { Header, HeaderSmall };
