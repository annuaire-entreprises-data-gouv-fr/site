import FloatingModal from '#components-ui/floating-modal';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
import { EspaceAgentLink } from './espace-agent-link';
import styles from './styles.module.css';

const Menu: React.FC<{
  session: ISession | null;
  pathFrom: string;
  useAgentCTA: boolean;
}> = ({ session, pathFrom, useAgentCTA }) => {
  return isLoggedIn(session) ? (
    <div className={styles.menuLogout + ' fr-link'} tabIndex={0}>
      <div>
        <Icon slug="accountLine">
          <span className={styles.menuText}>
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
          </span>
        </Icon>
      </div>
      <FloatingModal
        id="feedback-modal"
        aria-modal="false"
        elevation="low"
        role="dialog"
        className={styles.dialog}
      >
        <a
          aria-label="Se déconnecter de l'espace agent public"
          href={`/api/auth/agent-connect/logout?pathFrom=${encodeURIComponent(
            pathFrom
          )}`}
        >
          <div>Se déconnecter</div>
        </a>
      </FloatingModal>
    </div>
  ) : useAgentCTA ? (
    <EspaceAgentLink pathFrom={pathFrom} />
  ) : null;
};

export default Menu;
