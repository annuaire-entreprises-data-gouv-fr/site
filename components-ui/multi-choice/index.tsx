"use client";

import type { ChangeEventHandler } from "react";
import styles from "./style.module.css";

export interface IProps {
  centered?: boolean;
  idPrefix?: string;
  large?: boolean;
  legend?: string;
  links?: boolean;
  name?: string;
  required?: boolean;
  values: {
    label: string;
    value?: string;
    onClick?: ChangeEventHandler<HTMLInputElement>;
    href?: string;
    checked?: boolean;
  }[];
}

export const MultiChoice: React.FC<IProps> = ({
  values,
  legend = "",
  idPrefix = "",
  name = "",
  required = false,
  large = false,
}) => (
  <>
    {legend && (
      <legend>
        <h2 style={{ fontSize: "1.2rem" }}>{legend}</h2>
      </legend>
    )}

    <div
      className={styles["radio-group"]}
      style={{
        justifyContent: large ? "center" : "flex-start",
      }}
    >
      {values.map(({ label, value, href, onClick, checked = false }, index) => (
        <div key={href || value || label}>
          {href ? (
            <a href={href} style={computeStyle(large)} tabIndex={0}>
              {label}
            </a>
          ) : (
            <>
              <input
                checked={onClick ? checked : undefined}
                defaultChecked={onClick ? undefined : checked}
                id={`${idPrefix}-${index}`}
                name={name}
                onChange={onClick ? onClick : undefined}
                required={required}
                type="radio"
                value={value}
              />
              <label
                className="fr-label"
                htmlFor={`${idPrefix}-${index}`}
                style={computeStyle(large)}
              >
                {label}
              </label>
            </>
          )}
        </div>
      ))}
    </div>
  </>
);

function computeStyle(large: boolean) {
  return {
    fontWeight: large ? "bold" : "inherit",
    fontSize: large ? "2rem" : "1rem",
    lineHeight: large ? "3rem" : "1.5rem",
    margin: large ? "15px 10px" : "5px",
  };
}
