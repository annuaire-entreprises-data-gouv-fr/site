'use client';
import React, { useState } from 'react';
import FloatingModal from '#components-ui/floating-modal';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { getAgentDisplayName, getAgentLabel } from '#models/user/helpers';
import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { EspaceAgentLink } from './espace-agent-link';
import styles from './styles.module.css';

const Menu: React.FC<{
  session: ISession | null;
  pathFrom: string;
  useAgentCTA: boolean;
}> = ({ session, pathFrom, useAgentCTA }) => {
  const userText = getAgentDisplayName(session);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const logoutUrl = `/api/auth/agent-connect/logout?pathFrom=${encodeURIComponent(
    pathFrom
  )}`;

  function logout() {
    window.location.href = logoutUrl;
  }

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowUserMenu(false);
      e.preventDefault();
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setShowUserMenu(true);
      e.preventDefault();
    }
    if ((e.key === 'Enter' || e.key === 'Space') && showUserMenu) {
      setShowUserMenu(!showUserMenu);
      e.preventDefault();
      e.stopPropagation();
      logout();
    }
  };

  if (!isLoggedIn(session)) {
    if (!useAgentCTA) {
      return null;
    }
    return <EspaceAgentLink pathFrom={pathFrom} />;
  }
  return (
    <div className={styles.menuLogout + ' '}>
      <button
        onKeyDown={handleButtonKeyDown}
        className="fr-link"
        onBlur={() => {
          setShowUserMenu(false);
        }}
        onClick={() => setShowUserMenu(!showUserMenu)}
        aria-haspopup="true"
        aria-expanded={showUserMenu}
        aria-controls="menu-user"
      >
        <span className="fr-sr-only">{userText}</span>
        <span aria-hidden className={styles.menuText}>
          <Icon slug="accountLine" alt="">
            {userText}
            &nbsp;(
            <strong
              style={{
                fontVariant: 'small-caps',
                color: constants.colors.espaceAgent,
              }}
            >
              {getAgentLabel(session)}
            </strong>
            ) &nbsp;
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              style={{
                transform: showUserMenu ? 'rotate(180deg)' : '',
                fill: 'var(--annuaire-colors-frBlue)',
              }}
              height="9"
              viewBox="0 0 12 9"
            >
              <polygon points="1 0, 11 0, 6 8"></polygon>
            </svg>
          </Icon>
        </span>
      </button>
      <FloatingModal
        elevation="low"
        role="menu"
        className={styles.dialog + ' ' + (showUserMenu ? styles.opened : '')}
        id="menu-user"
        aria-label="Menu de déconnexion"
      >
        <a
          aria-label="Se déconnecter de l'espace agent public"
          href={logoutUrl}
          tabIndex={-1}
          className="fr-link"
          onMouseDown={logout}
          role="menuitem"
        >
          <div>Se déconnecter</div>
        </a>
      </FloatingModal>
    </div>
  );
};

export default Menu;
