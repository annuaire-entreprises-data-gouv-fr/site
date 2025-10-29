import ButtonLink from "#components-ui/button";
import FullWidthContainer from "#components-ui/container";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import getSession from "#utils/server-side-helper/get-session";
import AgentNavigationLink from "./agent-navigation-link";
import styles from "./styles.module.css";

export default async function AgentNavigation() {
  const session = await getSession();

  const navLinks = [
    { id: "accueil", label: "Mon espace", href: "/compte/accueil" },
    { id: "groupes", label: "Mes groupes", href: "/compte/mes-groupes" },
  ];
  return (
    <FullWidthContainer
      style={{
        background:
          "radial-gradient(61.94% 118.71% at 36.66% 38.06%, #F9C5E1 0%, #D8E6FF 100%)",
      }}
    >
      <nav className={styles.navContainer}>
        <div className={`${styles.navContainerContent}`}>
          {session?.user?.isSuperAgent && (
            <ul
              aria-label="Navigation espace agent"
              className={`${styles.navTabsList} fr-tabs__list`}
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: This ul is used as a tablist
              role="tablist"
            >
              {navLinks.map(({ label, href, id }) => (
                <li className={styles.navTabItem} key={id} role="presentation">
                  <AgentNavigationLink href={href} id={id} label={label} />
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
