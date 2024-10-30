import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import LoadBar from '#components/load-bar';
import SearchBar from '#components/search-bar';
import constants from '#models/constants';
import { ApplicationRights, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import React from 'react';
import ChangelogNotification from '../changelog-notification';
import Menu from '../menu';
import styles from './styles.module.css';

type IProps = {
  currentSearchTerm?: string;
  useLogo?: boolean;
  useSearchBar?: boolean;
  useAgentCTA?: boolean;
  useAgentBanner?: boolean;
  useMap?: boolean;
  useInfoBanner?: boolean;
  session: ISession | null;
  plugin?: JSX.Element;
};

export const HeaderCore: React.FC<IProps> = ({
  currentSearchTerm = '',
  useLogo = false,
  useSearchBar = false,
  useAgentCTA = false,
  useAgentBanner = false,
  useMap = false,
  plugin = null,
  session,
}) => {
  return (
    <>
      <LoadBar session={session} />
      <header
        role="banner"
        className="fr-header"
        style={{ filter: !useSearchBar ? 'none' : undefined }}
      >
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
                      filter: !useSearchBar ? 'none' : undefined,
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
                            <svg
                              width={140}
                              height={54}
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 137 61"
                            >
                              <path
                                d="m26.5 0 26.4 15.3v30.4L26.5 61 .1 45.7V15.3L26.5 0Z"
                                fill="#E8EDFF"
                              />
                              <path
                                d="M13.4 27H19v1.5h-7.4V15.6h1.8V27ZM19.3 15a3.4 3.4 0 0 1 .5 1.7c0 .5-.1 1-.4 1.5-.2.5-.6 1-1 1.4l-.6-.3v-.1l-.1-.1v-.2a4.6 4.6 0 0 0 .6-.8l.2-.5a2 2 0 0 0 0-1.1l-.3-.7v-.2l.1-.3 1-.4ZM21 28.5h3.4l1-3H30l1 3h3.4L29.7 16h-4.1L21 28.5Zm5.4-5.7 1.3-3.7 1.2 3.7h-2.5ZM36.5 28.5h2.9V23c.1-.3.6-1.1 1.6-1.1s1.4.6 1.4 1.5v5.2h2.9v-5.3c0-2.8-1.6-4.1-3.5-4.1-1.1 0-1.9.3-2.4.8v-.5h-3v9.1ZM47.7 28.5h2.9V23c.2-.3.6-1.1 1.6-1.1s1.4.6 1.4 1.5v5.2h2.9v-5.3c0-2.8-1.6-4.1-3.5-4.1-1 0-1.8.3-2.4.8v-.5h-2.9v9.1ZM64.7 24.6c0 1-.5 1.6-1.5 1.6-1.1 0-1.6-.7-1.6-1.6v-5.2h-2.9v5c0 2.7 1.6 4.5 4.4 4.5 2.8 0 4.5-1.8 4.5-4.5v-5h-3v5.2ZM72.3 28.8c1 0 2-.4 2.5-1v.7h2.9v-5.7c0-2-1.4-3.7-4.2-3.7-1.7 0-3.1.7-4 1.8l2.1 1.6c.4-.6 1-1 1.8-1s1.4.6 1.4 1.2l-2.5.5c-2 .3-3 1.4-3 2.8 0 1.7 1.2 2.8 3 2.8Zm-.3-3c0-.4.3-.7 1-.8l1.8-.3v.9c-.3.5-1 1-1.8 1-.6 0-1-.3-1-.8ZM81.6 18.4c1 0 1.7-.8 1.7-1.8s-.8-1.8-1.7-1.8c-1 0-1.9.9-1.9 1.8 0 1 .9 1.8 1.9 1.8ZM80 28.5H83v-9H80v9ZM85.5 28.5h2.8V23c.2-.3 1-1 2-1l1 .2v-2.8l-.8-.1c-.9 0-1.6.4-2.2.9v-.8h-2.8v9.1ZM101.4 27l-2-1.6c-.4.6-1.2 1-2 1-1.1 0-2-.4-2.2-1.6h5.9l.2-1.5c0-2.5-1.7-4.2-4.3-4.2-3 0-4.7 2.2-4.7 4.9 0 2.6 1.7 4.9 5 4.9a5 5 0 0 0 4.1-1.8ZM97 21.5c1 0 1.6.7 1.6 1.3h-3.3c.2-.9.8-1.3 1.7-1.3ZM108.1 24c0 2.6 1.8 4.9 4.7 4.9 1.3 0 2.4-.6 3.2-1.5v1.1h1.5V15H116v5.5c-.8-.9-1.9-1.4-3.2-1.4-2.9 0-4.7 2.2-4.7 4.9Zm1.6 0c0-2 1.3-3.5 3.2-3.5 1.3 0 2.4.6 3 1.7v3.6c-.6 1-1.7 1.6-3 1.6-1.9 0-3.2-1.5-3.2-3.4ZM129 27l-1.2-.9c-.5.8-1.5 1.4-2.7 1.4-2 0-3.3-1.3-3.4-3.5h7v-1c0-2.2-1.5-4-4-4-2.8 0-4.6 2.2-4.6 5 0 2.6 2 4.9 5 4.9 1.7 0 3-.8 3.9-1.9Zm-4.3-6.6c1.6 0 2.5 1 2.6 2.4h-5.5c.3-1.5 1.4-2.4 2.9-2.4ZM130.5 27.3c.8 1 2 1.6 3.4 1.6 1.7 0 3-1 3-2.8 0-3-4.5-2.4-4.5-4.5 0-.7.5-1.2 1.5-1.2.8 0 1.5.4 2 1l1-.8a3.7 3.7 0 0 0-3-1.5c-1.8 0-3 1.1-3 2.6 0 3.2 4.6 2.5 4.6 4.5 0 .8-.6 1.4-1.6 1.4s-1.7-.5-2.3-1.3l-1 1ZM21.8 46.5h7.8V44H25v-2.5H29v-2.6H25v-2.2h4.6v-2.7h-7.8v12.6ZM32.2 46.5H35V41c.2-.3.7-1.1 1.7-1.1.9 0 1.4.6 1.4 1.5v5.2H41v-5.3c0-2.8-1.6-4.1-3.6-4.1-1 0-1.8.3-2.4.8v-.5h-2.8v9.1ZM44 43c0 2.2 1 3.7 3.5 3.7.9 0 1.4-.1 2-.3v-2.5l-1.5.2c-.7 0-1.1-.4-1.1-1.1v-3h2.5v-2.6h-2.5v-2.2H44v2.2h-1.7V40H44v3ZM51.4 46.5h2.8V41c.2-.3.9-1 2-1l1 .2v-2.8l-.8-.1c-.9 0-1.6.4-2.2.9v-.8h-2.8v9.1ZM67.3 45l-2-1.6c-.4.6-1.2 1-2 1-1.1 0-2-.4-2.2-1.6H67l.2-1.5c0-2.5-1.7-4.2-4.3-4.2-3 0-4.7 2.2-4.7 4.9 0 2.6 1.7 4.9 5 4.9a5 5 0 0 0 4.1-1.8Zm-4.5-5.6c1 0 1.5.7 1.6 1.3H61c.2-.9.8-1.3 1.7-1.3ZM69.3 51H72v-5c.7.6 1.4.9 2.6.9 2.9 0 4.5-2.3 4.5-5 0-2.6-1.6-4.8-4.5-4.8-1.2 0-2 .3-2.6.8v-.5h-2.8V51Zm5-11.2c1.2 0 2 .8 2 2.2 0 1.3-.8 2.2-2 2.2-1 0-1.6-.4-2.2-1v-2.4c.5-.6 1.2-1 2.1-1ZM81.2 46.5h2.9V41c.1-.3.8-1 1.9-1l1 .2v-2.8l-.7-.1c-1 0-1.7.4-2.2.9v-.8h-2.9v9.1ZM90.3 36.4c1 0 1.7-.8 1.7-1.8s-.8-1.8-1.7-1.8c-1 0-1.9.9-1.9 1.8 0 1 .9 1.8 1.9 1.8Zm-1.5 10.1h2.9v-9h-2.9v9ZM93.3 45.1c1 1 2.1 1.8 3.9 1.8 1.7 0 3.4-1 3.4-3.1 0-3.2-4.2-2.7-4.2-3.9 0-.3.3-.6.8-.6.6 0 1.1.5 1.6 1l1.9-1.6c-.7-1-2.1-1.6-3.5-1.6-2 0-3.5 1.2-3.5 3 0 3.1 4.2 2.6 4.2 3.9 0 .3-.3.6-.8.6-.8 0-1.4-.5-1.9-1.2l-1.9 1.7ZM111.2 45l-2-1.6c-.5.6-1.2 1-2 1-1.2 0-2-.4-2.2-1.6h5.9l.1-1.5c0-2.5-1.7-4.2-4.2-4.2-3.1 0-4.7 2.2-4.7 4.9 0 2.6 1.7 4.9 5 4.9a5 5 0 0 0 4-1.8Zm-4.5-5.6c1 0 1.5.7 1.6 1.3H105c.2-.9.8-1.3 1.7-1.3ZM112.3 45.1c1 1 2 1.8 3.8 1.8 1.8 0 3.5-1 3.5-3.1 0-3.2-4.2-2.7-4.2-3.9 0-.3.2-.6.7-.6.7 0 1.2.5 1.7 1l1.8-1.6c-.7-1-2-1.6-3.5-1.6-2 0-3.4 1.2-3.4 3 0 3.1 4.2 2.6 4.2 3.9 0 .3-.3.6-.8.6-.8 0-1.4-.5-2-1.2l-1.8 1.7Z"
                                fill="#161616"
                              />
                            </svg>
                          </a>
                        </div>
                      ) : null}
                      <div className={styles.menuMobile}>
                        <ChangelogNotification />
                        <Menu session={session} useAgentCTA={useAgentCTA} />
                      </div>
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
                          <ChangelogNotification />
                        </li>
                        <li>
                          <Menu session={session} useAgentCTA={useAgentCTA} />
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
      {useAgentBanner && hasRights(session, ApplicationRights.isAgent) && (
        <div className={styles.agentBanner} role="banner">
          <PrintNever>
            <div className="fr-container">
              Votre compte <strong>agent public</strong> vous donne accès à des
              données réservées à l’administration, identifiables par la mention
              “{' '}
              <strong style={{ color: constants.colors.espaceAgent }}>
                <Icon size={12} slug="lockFill">
                  Réservé(es) aux agents publics
                </Icon>
              </strong>{' '}
              ”.
            </div>
          </PrintNever>
        </div>
      )}
    </>
  );
};
