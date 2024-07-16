'use client';

import { Icon } from '#components-ui/icon/wrapper';
import { logConversionEvent } from '#utils/matomo';
import styles from './styles.module.css';

export const EspaceAgentLink = ({ pathFrom }: { pathFrom: string }) => (
  <a
    href={`/lp/agent-public?pathFrom=${encodeURIComponent(pathFrom)}`}
    className="fr-link"
    title="Se connecter à l'espace agent"
    onClick={() => logConversionEvent('HEADER_LOGIN')}
    aria-label="Accéder à la page de connexion de l'espace agent public"
  >
    <span className="fr-sr-only">Accéder à l’espace agent public</span>
    <Icon slug="accountLine" alt="" aria-hidden>
      <span className={styles.menuText}>Espace agent public</span>
    </Icon>
  </a>
);
