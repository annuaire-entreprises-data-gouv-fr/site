"use client";

import { clsx } from "clsx";
import type React from "react";
import type { MouseEventHandler, PropsWithChildren } from "react";
import styles from "./styles.module.css";

type IProps = {
  id?: string;
  role?: string;
  small?: boolean;
  to?: string;
  type?: "button" | "submit" | null;
  disabled?: boolean;
  alt?: boolean;
  target?: "_blank";
  ariaLabel?: string;
  nofollow?: boolean;
  hideExternalIcon?: boolean;
  onClick?: MouseEventHandler;
};

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
