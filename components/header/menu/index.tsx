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
    <div className={styles.menuLogout + ' fr-link'}>
      <div>
        <Icon slug="accountLine">
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
    <a
      href={`/lp/agent-public?pathFrom=${encodeURIComponent(pathFrom)}`}
      className="fr-link"
    >
      <Icon slug="accountLine">Espace agent public</Icon>
    </a>
  ) : null;
};

export default Menu;
