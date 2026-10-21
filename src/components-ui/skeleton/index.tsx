import clsx from "clsx";
import type React from "react";
import styles from "./styles.module.css";

/**
 * Shimmering placeholder for a piece of content that is loading
 */
export const Bone: React.FC<{
  className?: string;
  height?: string;
  inline?: boolean;
  width: string;
}> = ({ className, height, inline = false, width }) => (
  <span
    aria-hidden="true"
    className={clsx(styles.bone, inline && styles.inline, className)}
    style={{ width, height }}
  />
);
