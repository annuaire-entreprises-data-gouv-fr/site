'use client';
import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
import Logo from '#components-ui/logo';
import SearchBar from '#components/search-bar';
import constants from '#models/constants';
import { ISession, isLoggedIn } from '#utils/session';
import styles from './styles.module.css';

type IProps = {
  currentSearchTerm?: string;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  session: ISession | null;
  pathFrom: string | null;
};

export const HeaderCore: React.FC<IProps> = ({
  currentSearchTerm = '',
  useLogo = false,
  useSearchBar = false,
  useAgentCTA = false,
  session,
  pathFrom,
}) => {
  return (
    <div className="fr-header__body">
      <div className="fr-container">
        <div className="fr-header__body-row">
          <div
            className="fr-header__brand"
            style={{ filter: !useSearchBar ? 'none !important' : undefined }}
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
                        href={`/api/auth/agent-connect/logout?pathFrom=${pathFrom}`}
                      >
                        <div>Se déconnecter</div>
                      </a>
                    </div>
                  ) : useAgentCTA ? (
                    <a href="/connexion/agent-public" className="fr-link">
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
  );
};
