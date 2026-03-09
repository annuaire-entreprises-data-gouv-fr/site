import type {
  CSSProperties,
  MouseEventHandler,
  PropsWithChildren,
} from "react";
import { Link } from "#components/Link";
import type { IIconsSlug } from "#components-ui/icon";
import { Icon } from "#components-ui/icon/wrapper";
import styles from "./styles.module.css";

interface IProps extends IPartialBadgeProps {
  backgroundColor?: string;
  fontColor?: string;
  icon: IIconsSlug;
}

export interface IPartialBadgeProps {
  isSelected?: boolean;
  label?: string;
  link?: {
    href: string;
    "aria-label": string;
  };
  onClick?: MouseEventHandler;
  small?: boolean;
}

function BadgeContainer({
  children,
  className,
  link,
  onClick,
  style,
}: PropsWithChildren<{
  className?: string;
  link?: IPartialBadgeProps["link"];
  onClick?: MouseEventHandler;
  style?: CSSProperties;
}>) {
  return link ? (
    <Link
      aria-label={link["aria-label"]}
      className={className}
      href={link.href}
      onClick={onClick}
      style={style}
    >
      {children}
    </Link>
  ) : onClick ? (
    <button
      className={className}
      onClick={onClick}
      style={{ background: "none", font: "inherit", padding: 0, ...style }}
      type="button"
    >
      {children}
    </button>
  ) : (
    <span className={className} style={style}>
      {children}
    </span>
  );
}

export function Badge({
  icon,
  label,
  small = false,
  isSelected = false,
  backgroundColor,
  fontColor,
  onClick,
  link,
}: IProps) {
  return (
    <BadgeContainer
      className={`${styles.badgeWrapper} ${
        onClick && !link && !isSelected ? styles.badgeWrapperOnClick : ""
      } ${onClick ? " cursor-pointer" : ""}`}
      link={link}
      onClick={onClick}
      style={{
        border: isSelected ? "2px solid #000091" : "2px solid transparent",
        fontSize: small ? "0.9rem" : "1rem",
      }}
    >
      <span
        aria-hidden
        className={styles.badgeIcon}
        style={{
          backgroundColor,
          color: fontColor,
          padding: small ? "0 6px" : "2px 8px",
        }}
      >
        <Icon size={16} slug={icon} />
      </span>
      <span
        className={styles.badgeLabel}
        style={{
          padding: small ? "0 8px 0 6px" : "2px 10px 2px 8px",
        }}
      >
        {label}
      </span>
    </BadgeContainer>
  );
}
