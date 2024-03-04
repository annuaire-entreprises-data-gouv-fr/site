import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import Logo from '#components-ui/logo';
import { PrintNever } from '#components-ui/print-visibility';
import LoadBar from '#components/load-bar';
import SearchBar from '#components/search-bar';
import constants from '#models/constants';
import { ISession, isLoggedIn } from '#utils/session';
import styles from './styles.module.css';

type IProps = {
  currentSearchTerm?: string;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useMap?: boolean;
  session: ISession | null;
  plugin?: JSX.Element;
  pathFrom: string;
};

export const HeaderCore: React.FC<IProps> = ({
  currentSearchTerm = '',
  useLogo = false,
  useSearchBar = false,
  useAgentCTA = false,
  useMap = false,
  plugin = null,
  session,
  pathFrom,
}) => {
  return (
    <header
      role="banner"
      className="fr-header"
      style={{ filter: !useSearchBar ? 'none !important' : undefined }}
    >
      <LoadBar isAgent={isLoggedIn(session)} />

      <PrintNever>
        <form
          id="search-bar-form"
          action={useMap ? '/rechercher/carte' : '/rechercher'}
          method="get"
        >
          <div className="fr-header__body">
            <div className="fr-container">
              <div className="fr-header__body-row">
                <div
                  className="fr-header__brand"
                  style={{
                    filter: !useSearchBar ? 'none !important' : undefined,
                  }}
                >
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
                      <div
                        style={{
                          order: '2',
                          marginRight: '15px',
                        }}
                      >
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
                    <div className={styles.notFrSearch}>
                      <SearchBar defaultValue={currentSearchTerm} />
                    </div>
                  ) : null}
                </div>
                <div className="fr-header__tools">
                  <div className="fr-header__tools-links">
                    <ul className="fr-links-group">
                      <li>
                        {isLoggedIn(session) ? (
                          <div className={styles.menuLogout + ' fr-link'}>
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
                              href={`/api/auth/agent-connect/logout?pathFrom=${encodeURIComponent(
                                pathFrom
                              )}`}
                            >
                              <div>Se déconnecter</div>
                            </a>
                          </div>
                        ) : useAgentCTA ? (
                          <a href="/lp/agent-public" className="fr-link">
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
          {plugin}
        </form>
      </PrintNever>
    </header>
  );
};
