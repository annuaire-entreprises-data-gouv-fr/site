import ButtonLink from "#/components-ui/button";
import FullWidthContainer from "#/components-ui/container";
import { Icon } from "#/components-ui/icon/wrapper";
import { useAuth } from "#/contexts/auth.context";
import constants from "#/models/constants";
import AgentNavigationLink from "./agent-navigation-link";
import styles from "./styles.module.css";

const navLinks = [
  { id: "accueil", label: "Mon espace", to: "/compte/accueil" },
  { id: "groupes", label: "Mes groupes", to: "/compte/mes-groupes" },
] as const;

export default function AgentNavigation() {
  const { user } = useAuth();

  return (
    <FullWidthContainer
      style={{
        background:
          "radial-gradient(61.94% 118.71% at 36.66% 38.06%, #F9C5E1 0%, #D8E6FF 100%)",
      }}
    >
      <nav className={styles.navContainer}>
        <div className={`${styles.navContainerContent}`}>
          {user?.isSuperAgent && (
            <ul
              aria-label="Navigation espace agent"
              className={`${styles.navTabsList} fr-tabs__list`}
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: This ul is used as a tablist
              role="tablist"
            >
              {navLinks.map(({ label, to, id }) => (
                <li className={styles.navTabItem} key={id} role="presentation">
                  <AgentNavigationLink id={id} label={label} to={to} />
                </li>
              ))}
            </ul>
          )}
          <div className={styles.navLinks}>
            <div className={styles.button}>
              <ButtonLink
                alt
                ariaLabel="Nouveautés"
                hideExternalIcon
                target="_blank"
                to="/historique-des-modifications"
              >
                <Icon slug="giftFill">Nouveautés</Icon>
              </ButtonLink>
            </div>
            <div className={styles.button}>
              <ButtonLink
                alt
                ariaLabel="Salon Tchap"
                hideExternalIcon
                target="_blank"
                to={constants.links.tchap}
              >
                <Icon slug="chat3Fill">Salon Tchap</Icon>
              </ButtonLink>
            </div>
            <div className={styles.button}>
              <ButtonLink
                alt
                ariaLabel="Documentation"
                hideExternalIcon
                target="_blank"
                to={constants.links.documentation.home}
              >
                <Icon slug="bookletFill">Documentation</Icon>
              </ButtonLink>
            </div>
          </div>
        </div>
      </nav>
    </FullWidthContainer>
  );
}
