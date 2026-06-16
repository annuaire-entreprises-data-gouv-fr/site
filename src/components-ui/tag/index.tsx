import type { LinkProps } from "@tanstack/react-router";
import { clsx } from "clsx";
import type React from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import { Link } from "#/components/link";
import styles from "./styles.module.css";

interface ITagProps {
  color?:
    | "default"
    | "error"
    | "info"
    | "new"
    | "success"
    | "warning"
    | "agent"
    | "greenEmeraude"
    | "yellowTournesol"
    | "brownOpera"
    | "pinkMacaron"
    | "cafeCreme";
  id?: string;
  // title?: string;
  link?: LinkProps & { "aria-label": string };
  maxWidth?: string;
  size?: "medium" | "small";
}

function TagContainer({
  children,
  className,
  id,
  link,
  style,
}: PropsWithChildren<{
  className?: string;
  id?: string;
  link?: ITagProps["link"];
  style?: CSSProperties;
}>) {
  return link ? (
    <Link className={className} id={id} style={style} {...link}>
      {children}
    </Link>
  ) : (
    <span className={className} id={id} role="status" style={style}>
      {children}
    </span>
  );
}

export const Tag: React.FC<PropsWithChildren<ITagProps>> = ({
  children,
  id,
  size = "medium",
  color = "default",
  link,
}) => (
  <TagContainer
    className={clsx(
      styles.frBadge,
      "fr-badge",
      "fr-badge--no-icon",
      badgeSize[size],
      badgeColor[color]
    )}
    id={id}
    link={link}
    style={{
      margin: "3px",
    }}
  >
    {children}
  </TagContainer>
);

const badgeSize = {
  small: "fr-badge--sm",
  medium: "fr-badge--md",
};

const badgeColor = {
  default: "",
  new: "fr-badge--new",
  error: "fr-badge--error",
  warning: "fr-badge--warning",
  info: "fr-badge--info",
  success: "fr-badge--success",
  agent: "fr-badge--purple-glycine",
  greenEmeraude: "fr-badge--green-emeraude",
  yellowTournesol: "fr-badge--yellow-tournesol",
  brownOpera: "fr-badge--brown-opera",
  pinkMacaron: "fr-badge--pink-macaron",
  cafeCreme: "fr-badge--brown-cafe-creme",
};
