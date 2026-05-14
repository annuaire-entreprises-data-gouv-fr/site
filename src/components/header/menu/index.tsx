import { clsx } from "clsx";
import { Link } from "#/components/Link";
import FloatingModal from "#/components-ui/floating-modal";
import { Icon } from "#/components-ui/icon/wrapper";
import { getAgentDisplayName } from "#/models/authentication/user/helpers";
import { isLoggedIn } from "#/models/authentication/user/rights";
import type { ISession } from "#/models/authentication/user/session";
import constants from "#/models/constants";
import { EspaceAgentLink } from "./espace-agent-link";
import styles from "./styles.module.css";

const Menu: React.FC<{
  user: ISession["user"] | null;
  useAgentCTA: boolean;
}> = ({ user, useAgentCTA }) =>
  isLoggedIn({ user }) ? (
    <div className={clsx(styles.menuLogout, "fr-link")}>
      <div>
        <Icon slug="accountLine">
          <span className={styles.menuText}>
            {getAgentDisplayName({ user })}
            &nbsp;(
            <strong
              style={{
                fontVariant: "small-caps",
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
        aria-modal="false"
        className={styles.dialog}
        elevation="low"
        id="menu-modal"
        role="dialog"
      >
        <Link
          aria-label="Gestion de mon compte agent public"
          to="/compte/accueil"
        >
          Mon espace
        </Link>
        {user?.isSuperAgent && (
          <Link aria-label="Gestion de mes groupes" to="/compte/mes-groupes">
            Mes groupes
          </Link>
        )}
        <a
          aria-label="Documentation de l’espace agent public"
          href={constants.links.documentation.home}
          rel="noopener nopener noreferer"
          target="_blank"
        >
          Consulter la documentation
        </a>
        <a
          aria-label="Canal Tchap"
          href={constants.links.tchap}
          rel="noopener nopener noreferer"
          target="_blank"
        >
          Nous retrouver sur Tchap
        </a>
        <a
          aria-label="Se déconnecter de l'espace agent public"
          href={"/api/auth/agent-connect/logout"}
        >
          <strong>Se déconnecter</strong>
        </a>
      </FloatingModal>
    </div>
  ) : useAgentCTA ? (
    <EspaceAgentLink />
  ) : null;

export default Menu;
