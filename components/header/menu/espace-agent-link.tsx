'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { logConversionEvent } from '#utils/matomo';
import styles from './styles.module.css';

export const EspaceAgentLink = () => (
  <a
    href={'/lp/agent-public'}
    className="fr-link"
    title="Se connecter à l'espace agent"
    onClick={() => logConversionEvent('HEADER_LOGIN')}
    aria-label="Accéder à la page de connexion de l'espace agent public"
  >
    <Icon slug="accountLine">
      <span className={styles.menuText}>Espace agent public</span>
    </Icon>
  </a>
);
