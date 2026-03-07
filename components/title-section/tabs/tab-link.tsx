import { Link } from "#components/Link";
import styles from "./styles.module.css";

interface IProps {
  active: boolean;
  href: string;
  label: string;
  noFollow?: boolean;
  width?: string;
}
export default function TabLink({
  active,
  href,
  label,
  noFollow,
  width,
}: IProps) {
  return (
    <Link
      className={`${active ? styles.activeLink : ""} no-style-link`}
      href={href}
      rel={noFollow ? "nofollow" : ""}
      style={{ width }}
    >
      {active ? label : <h2>{label}</h2>}
    </Link>
  );
}
