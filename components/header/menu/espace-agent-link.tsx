"use client";

import { Icon } from "#components-ui/icon/wrapper";
import { logConversionEvent } from "#utils/matomo";
import styles from "./styles.module.css";

export const EspaceAgentLink = () => (
  <a
    aria-label="Accéder à la page de connexion de l'espace agent public"
    className="fr-link"
    href={"/lp/agent-public"}
    onClick={() => logConversionEvent("HEADER_LOGIN")}
    title="Se connecter à l'espace agent"
  >
    <Icon slug="accountLine">
      <span className={styles.menuText}>Espace agent public</span>
    </Icon>
  </a>
);
