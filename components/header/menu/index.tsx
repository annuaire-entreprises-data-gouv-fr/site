import FloatingModal from '#components-ui/floating-modal';
import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import { isLoggedIn } from '#models/user/rights';
import { ISession } from '#models/user/session';
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
        role="dialog"
        className={styles.dialog}
        aria-label="Partager une idée, un bug, une question ou une donnée manquante avec l'équipe de l'Annuaire des Entreprises"
      >
        <a
          href={`/api/auth/agent-connect/logout?pathFrom=${encodeURIComponent(
            pathFrom
          )}`}
        >
          <div>Se déconnecter</div>
        </a>
      </FloatingModal>
    </div>
  ) : useAgentCTA ? (
    <a
      href={`/lp/agent-public?pathFrom=${encodeURIComponent(pathFrom)}`}
      className="fr-link"
      title="Se connecter à l'espace agent"
      aria-label="Accéder à la page de connexion de l'espace agent public"
    >
      <Icon slug="accountLine">
        <span className={styles.menuText}>Espace agent public</span>
      </Icon>
    </a>
  ) : null;
};

export default Menu;
