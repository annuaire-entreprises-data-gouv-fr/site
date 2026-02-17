import clsx from "clsx";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import styles from "./agent-documentation.module.css";

export function AgentDocumentation() {
  return (
    <a
      className={clsx("fr-link", styles.agentLink)}
      href={constants.links.documentation.agentDecouverte}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Icon slug="bookletFill">
        <span className={styles.agentDocumentationText}>Documentation</span>
      </Icon>
    </a>
  );
}
