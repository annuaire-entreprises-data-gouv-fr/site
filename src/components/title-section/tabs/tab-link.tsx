import type { ComponentProps } from "react";
import { Link } from "#/components/link";
import styles from "./styles.module.css";

interface IProps extends ComponentProps<typeof Link> {
  active: boolean;
  label: string;
  noFollow?: boolean;
  width?: string;
}
export default function TabLink({
  active,
  label,
  noFollow,
  width,
  ...props
}: IProps) {
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className={`${active ? styles.activeLink : ""} no-style-link`}
      rel={noFollow ? "nofollow" : ""}
      resetScroll={false}
      style={{ width }}
      {...props}
    >
      {label}
    </Link>
  );
}
