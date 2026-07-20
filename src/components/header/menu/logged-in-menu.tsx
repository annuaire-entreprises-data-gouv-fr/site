import clsx from "clsx";
import { Link } from "#/components/link";
import FloatingModal from "#/components-ui/floating-modal";
import { Icon } from "#/components-ui/icon/wrapper";
import type { IAgentInfo } from "#/models/authentication/agent";
import constants from "#/models/constants";
import styles from "./styles.module.css";

interface ILoggedInMenuVariationAProps {
  user: IAgentInfo;
}

export function LoggedInMenu({ user }: ILoggedInMenuVariationAProps) {
  return (
    <div className={clsx(styles.menuLogout, "fr-link")}>
      <div>
        <Icon slug="accountLine">
          <span className={styles.menuText}>
            Mon espace &nbsp;(
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
          <Icon slug="shieldLine">Mes droits</Icon>
        </Link>
        {user?.isSuperAgent && (
          <Link aria-label="Gestion de mes groupes" to="/compte/mes-groupes">
            <Icon slug="team">Mes groupes</Icon>
          </Link>
        )}
        <a
          aria-label="Documentation de l’espace agent public"
          href={constants.links.documentation.home}
          rel="noopener nopener noreferer"
          target="_blank"
        >
          Documentation
        </a>
        <a
          aria-label="Canal Tchap"
          href={constants.links.tchap}
          rel="noopener nopener noreferer"
          target="_blank"
        >
          Salon Tchap
        </a>
        <a
          aria-label="Se déconnecter de l'espace agent public"
          href={"/api/auth/agent-connect/logout"}
        >
          <strong>Se déconnecter</strong>
        </a>
      </FloatingModal>
    </div>
  );
}
