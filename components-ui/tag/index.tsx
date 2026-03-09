import type React from "react";
import type { CSSProperties, PropsWithChildren } from "react";
import styles from "./styles.module.css";

interface ITagProps {
  color?:
    | "default"
    | "error"
    | "info"
    | "new"
    | "success"
    | "warning"
    | "agent";
  id?: string;
  // title?: string;
  link?: {
    href: string;
    "aria-label": string;
  };
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
    <a
      aria-label={link["aria-label"]}
      className={className}
      href={link.href}
      id={id}
      style={style}
    >
      {children}
    </a>
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
}) => {
  return (
    <TagContainer
      className={
        styles.frBadge +
        ` fr-badge fr-badge--no-icon ${badgeSize[size]} ${badgeColor[color]}`
      }
      id={id}
      link={link}
      style={{
        margin: "3px",
      }}
    >
      {children}
    </TagContainer>
  );
};

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
};
