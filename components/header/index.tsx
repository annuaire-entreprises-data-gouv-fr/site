'use client';
import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import Logo from '#components-ui/logo';
import { PrintNever } from '#components-ui/print-visibility';
import { AdvancedSearch } from '#components/advanced-search';
import SearchBar from '#components/search-bar';
import constants from '#models/constants';
import { IParams } from '#models/search-filter-params';
import { isLoggedIn } from '#utils/session';
import usePathFromRouter from 'hooks/use-path-from-router';
import useSession from 'hooks/use-session';

type IProps = {
  currentSearchTerm?: string;
  useMap?: boolean;
  searchParams?: IParams;
  useAdvancedSearch?: boolean;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
};

export const Header: React.FC<IProps> = ({
  currentSearchTerm = '',
  searchParams = {},
  useMap = false,
  useLogo = false,
  useAdvancedSearch = false,
  useSearchBar = false,
  useAgentCTA = false,
}) => {
  const session = useSession();
  const pathFrom = usePathFromRouter();
  return (
    <>
      <header role="banner" className="fr-header">
        <div
          id="loader-bar"
          style={{
            background: isLoggedIn(session)
              ? constants.colors.espaceAgent
              : 'transparent',
          }}
        />
        <PrintNever>
          <form
            id="search-bar-form"
            action={useMap ? '/rechercher/carte' : '/rechercher'}
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
                      {useSearchBar || useLogo ? (
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
                      ) : null}
                      <div className="fr-header__navbar"></div>
                    </div>
                    {useSearchBar ? (
                      <div className="not-fr-search">
                        <SearchBar defaultValue={currentSearchTerm} />
                      </div>
                    ) : null}
                  </div>
                  <div className="fr-header__tools">
                    <div className="fr-header__tools-links">
                      <ul className="fr-links-group">
                        <li>
                          {isLoggedIn(session) ? (
                            <div className="fr-link menu-logout">
                              <div>
                                <Icon slug="user">
                                  {session?.user?.fullName ||
                                    session?.user?.email ||
                                    'Utilisateur inconnu'}
                                  &nbsp;(
                                  <strong
                                    style={{
                                      fontVariant: 'small-caps',
                                      color: constants.colors.espaceAgent,
                                    }}
                                  >
                                    agent public
                                  </strong>
                                  )
                                </Icon>
                              </div>
                              <a
                                href={`/api/auth/agent-connect/logout?pathFrom=${pathFrom}`}
                              >
                                <div>Se déconnecter</div>
                              </a>
                            </div>
                          ) : useAgentCTA ? (
                            <a
                              href="/connexion/agent-public"
                              className="fr-link"
                            >
                              <Icon slug="user">Espace agent public</Icon>
                            </a>
                          ) : null}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {useAdvancedSearch ? (
              <AdvancedSearch
                searchParams={searchParams}
                currentSearchTerm={currentSearchTerm}
                isMap={useMap}
              />
            ) : null}
          </form>
        </PrintNever>
      </header>
      <style jsx>{`
        ${!useSearchBar
          ? `header.fr-header, div.fr-header__brand {
        filter: none !important;
      }`
          : ''}

        div.annuaire-logo {
          order: 2;
          margin-right: 15px;
        }

        .not-fr-search {
          width: 470px;
          max-width: 100%;
          flex-grow: 1;
        }

        div.with-session-banner {
          background-color: ${constants.colors.espaceAgent};
          color: #fff;
          font-size: 2rem;
          line-height: 3rem;
        }

        #loader-bar {
          transition: width 150ms ease-in-out;
          width: 100%;
          height: 3px;
          top: 0;
          left: 0;
          z-index: 1000;
          position: absolute;
        }

        div.menu-logout {
          position: relative;
        }
        div.menu-logout:hover {
          background-color: #eee;
          cursor: default;
        }
        div.menu-logout > a {
          position: absolute;
          top: 100%;
          left: 0;
          display: none;
          width: 100%;
          background-color: #fff;
          padding: 5px 15px;
          box-shadow: 0 10px 15px -10px rgba(0, 0, 0, 0.5);
        }
        div.menu-logout > a:hover {
          background-color: #f8f8f8;
        }

        div.menu-logout:hover > a {
          display: block;
        }

        @media print {
          .fr-header {
            display: none !important;
          }
        }
        @media only screen and (min-width: 1px) and (max-width: 992px) {
          .not-fr-search {
            width: 100%;
            margin: 0.75rem;
            margin-top: 0;
          }
        }
      `}</style>
    </>
  );
};
