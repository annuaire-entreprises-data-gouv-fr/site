"use client";

import { clsx } from "clsx";
import type React from "react";
import type { MouseEventHandler, PropsWithChildren } from "react";
import styles from "./styles.module.css";

interface IProps {
  alt?: boolean;
  ariaLabel?: string;
  disabled?: boolean;
  hideExternalIcon?: boolean;
  id?: string;
  nofollow?: boolean;
  onClick?: MouseEventHandler;
  role?: string;
  small?: boolean;
  target?: "_blank";
  to?: string;
  type?: "button" | "submit" | null;
}

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
  id,
  role,
  disabled,
  to,
  type,
  children,
  small = false,
  alt = false,
  ariaLabel,
  target = "",
  nofollow = false,
  hideExternalIcon = false,
  onClick = () => {},
}) => {
  const className = clsx("fr-btn", {
    "fr-btn--secondary": alt,
    "fr-btn--sm": small,
  });

  return to ? (
    <a
      aria-label={ariaLabel}
      className={clsx(className, {
        [styles.hideExternalIcon]: hideExternalIcon,
      })}
      href={(to || "").indexOf("@") > -1 ? `mailto:${to}` : to}
      id={id}
      onClick={onClick}
      rel={
        (target === "_blank" ? "noopener noreferrer" : "") +
        (nofollow ? "nofollow" : "")
      }
      role={role}
      target={target}
    >
      {children}
    </a>
  ) : (
    <button
      aria-label={ariaLabel}
      className={className}
      disabled={disabled}
      id={id}
      onClick={onClick}
      role={role}
      type={type || "submit"}
    >
      {children}
    </button>
  );
};

export default ButtonLink;
