import type { ComponentProps } from "react";
import { Link } from "#/components/Link";
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
      className={`${active ? styles.activeLink : ""} no-style-link`}
      rel={noFollow ? "nofollow" : ""}
      style={{ width }}
      {...props}
    >
      {active ? label : <h2>{label}</h2>}
    </Link>
  );
}
