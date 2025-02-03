import FloatingModal from '#components-ui/floating-modal';
import { Icon } from '#components-ui/icon/wrapper';
import {
  getAgentDisplayName,
  getAgentLabel,
} from '#models/authentication/user/helpers';
import { isLoggedIn } from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import constants from '#models/constants';
import { EspaceAgentLink } from './espace-agent-link';
import styles from './styles.module.css';

const Menu: React.FC<{
  session: ISession | null;
  useAgentCTA: boolean;
}> = ({ session, useAgentCTA }) => {
  return isLoggedIn(session) ? (
    <div className={styles.menuLogout + ' fr-link'} tabIndex={0}>
      <div>
        <Icon slug="accountLine">
          <span className={styles.menuText}>
            {getAgentDisplayName(session)}
            &nbsp;(
            <strong
              style={{
                fontVariant: 'small-caps',
                color: constants.colors.espaceAgent,
              }}
            >
              {getAgentLabel(session)}
            </strong>
            )
          </span>
        </Icon>
      </div>
      <FloatingModal
        id="menu-modal"
        aria-modal="false"
        elevation="low"
        role="dialog"
        className={styles.dialog}
      >
        <a aria-label="Gestion de mon compte agent public" href={'/compte'}>
          <div>Mon compte</div>
        </a>
        <a
          aria-label="Se déconnecter de l'espace agent public"
          href={'/api/auth/agent-connect/logout'}
        >
          <div>Se déconnecter</div>
        </a>
      </FloatingModal>
    </div>
  ) : useAgentCTA ? (
    <EspaceAgentLink />
  ) : null;
};

export default Menu;
