import type { MouseEventHandler } from "react";
import type { IIconsSlug } from "#components-ui/icon";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import styles from "./style.module.css";

const ActiveFilterLabel: React.FC<{
  label?: string;
  icon: IIconsSlug;
  query: string;
  onClick: MouseEventHandler;
}> = ({ label, icon, query, onClick }) => (
  <div className={`${styles["selected-filter-container"]} cursor-pointer`}>
    <span className="layout-center" onClick={onClick}>
      <Icon color={constants.colors.frBlue} slug={icon}>
        &nbsp;{label}
      </Icon>
    </span>
    <a className="no-style-link" href={query}>
      ✕
    </a>
  </div>
);

export default ActiveFilterLabel;
