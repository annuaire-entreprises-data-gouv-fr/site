'use client';
import React from 'react';
import { information, user } from '#components-ui/icon';
import Logo from '#components-ui/logo';
import { PrintNever } from '#components-ui/print-visibility';
import { AdvancedSearch } from '#components/advanced-search';
import SearchBar from '#components/search-bar';
import { IParams } from '#models/search-filter-params';
import { ISession, isLoggedIn } from '#utils/session';

interface IProps {
  currentSearchTerm?: string;
  useMap?: boolean;
  searchParams?: IParams;
  useAdvancedSearch?: boolean;
  useLogo?: boolean;
  useSearchBar?: boolean;
  session?: ISession | null;
}

export const Header: React.FC<IProps> = ({
  currentSearchTerm = '',
  searchParams = {},
  useMap = false,
  useLogo = false,
  useAdvancedSearch = false,
  useSearchBar = false,
  session = null,
}) => (
  <>
    <header role="banner" className="fr-header">
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
                    {isLoggedIn(session) ? (
                      <ul className="fr-links-group">
                        <li>
                          <a
                            className="fr-link"
                            href="/api/auth/mon-compte-pro/logout"
                          >
                            {user} Se déconnecter (
                            {session?.user?.email || 'Utilisateur inconnu'})
                          </a>
                        </li>
                      </ul>
                    ) : (
                      <ul className="fr-links-group">
                        <li>
                          <a className="fr-link" href="/comment-ca-marche">
                            {information} À propos
                          </a>
                        </li>
                      </ul>
                    )}
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
          {isLoggedIn(session) && (
            <div className="with-session-banner">
              <div className="fr-container">
                <b>Espace agent public</b>
              </div>
            </div>
          )}
        </form>
      </PrintNever>
    </header>
  </>
);
