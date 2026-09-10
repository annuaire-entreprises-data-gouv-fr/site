import type { MouseEventHandler } from "react";
import type { IIconsSlug } from "#/components-ui/icon";
import { Icon } from "#/components-ui/icon/wrapper";
import constants from "#/models/constants";
import styles from "./style.module.css";

const ActiveFilterLabel: React.FC<{
  label?: string;
  controls: string;
  expanded: boolean;
  icon: IIconsSlug;
  query: string;
  onClick: MouseEventHandler;
}> = ({ label, icon, query, onClick, controls, expanded }) => (
  <div className={`${styles["selected-filter-container"]} cursor-pointer`}>
    <button
      aria-controls={controls}
      aria-describedby={`${controls}-description`}
      aria-expanded={expanded}
      aria-haspopup="dialog"
      className="layout-center"
      onClick={onClick}
      style={{ background: "none", border: "none", padding: 0 }}
      type="button"
    >
      <Icon color={constants.colors.frBlue} slug={icon}>
        &nbsp;{label}
      </Icon>
    </button>
    <a
      aria-label={`Réinitialiser le filtre ${label}`}
      className="no-style-link"
      href={query}
    >
      ✕
    </a>
  </div>
);

export default ActiveFilterLabel;
