import clsx from "clsx";
import type { ComponentProps } from "react";
import { Link } from "#/components/link";
import styles from "./styles.module.css";

interface IProps extends ComponentProps<typeof Link> {
  active: boolean;
  className?: string;
  label: string;
  noFollow?: boolean;
  width?: string;
}
export default function TabLink({
  active,
  label,
  noFollow,
  width,
  className,
  ...props
}: IProps) {
  return (
    <Link
      className={clsx(active && styles.activeLink, "no-style-link", className)}
      rel={noFollow ? "nofollow" : ""}
      resetScroll={false}
      style={{ width }}
      {...props}
    >
      {active ? label : <h2>{label}</h2>}
    </Link>
  );
}
