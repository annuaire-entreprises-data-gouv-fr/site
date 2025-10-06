import type React from "react";
import type { PropsWithChildren } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import constants from "#models/constants";
import styles from "./style.module.css";

const FAQLink: React.FC<
  PropsWithChildren<{ tooltipLabel: string | React.JSX.Element; to?: string }>
> = ({ to, tooltipLabel, children }) => (
  <InformationTooltip
    ariaRelation="describedby"
    horizontalOrientation="left"
    label={children}
    left="0px"
    tabIndex={to ? undefined : 0}
    width={230}
  >
    <LinkOrSpan ariaLabel={`En savoir plus sur ${tooltipLabel}`} to={to}>
      <span className={styles.label + " " + (to ? styles.link : "")}>
        {tooltipLabel}{" "}
        <Icon color={constants.colors.frBlue} size={12} slug="information" />
      </span>
    </LinkOrSpan>
  </InformationTooltip>
);

const LinkOrSpan: React.FC<
  PropsWithChildren<{ to?: string; ariaLabel: string }>
> = ({ to, children, ariaLabel }) =>
  to ? (
    <a aria-label={ariaLabel} className="no-style-link" href={to}>
      {children}
    </a>
  ) : (
    <span>{children}</span>
  );

export default FAQLink;
