"use client";

import type React from "react";
import type { MouseEventHandler, PropsWithChildren } from "react";

type IProps = {
  role?: string;
  small?: boolean;
  to?: string;
  type?: "button" | "submit" | null;
  disabled?: boolean;
  alt?: boolean;
  target?: "_blank";
  ariaLabel?: string;
  nofollow?: boolean;
  onClick?: MouseEventHandler;
};

const ButtonLink: React.FC<PropsWithChildren<IProps>> = ({
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
  onClick = () => {},
}) => (
  <>
    {!to ? (
      <button
        aria-label={ariaLabel}
        className={`fr-btn ${alt ? " fr-btn--secondary " : ""} ${
          small ? " fr-btn--sm " : ""
        }`}
        disabled={disabled}
        onClick={onClick}
        role={role}
        type={type || "submit"}
      >
        {children}
      </button>
    ) : (
      <a
        aria-label={ariaLabel}
        className={`fr-btn ${alt ? " fr-btn--secondary " : ""} ${
          small ? " fr-btn--sm " : ""
        }`}
        href={(to || "").indexOf("@") > -1 ? `mailto:${to}` : to}
        rel={
          (target === "_blank" ? "noopener noreferrer" : "") +
          (nofollow ? "nofollow" : "")
        }
        role={role}
        target={target}
      >
        {children}
      </a>
    )}
  </>
);

export default ButtonLink;
