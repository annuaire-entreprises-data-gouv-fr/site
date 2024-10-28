import styles from './styles.module.css';
type IProps = {
  label: string;
  href: string;
  noFollow?: boolean;
  width?: string;
  active: boolean;
};
export default function TabLink({
  active,
  href,
  label,
  noFollow,
  width,
}: IProps) {
  return (
    <a
      className={`${active ? styles.activeLink : ''} no-style-link`}
      href={href}
      rel={noFollow ? 'nofollow' : ''}
      style={{ width }}
    >
      {active ? label : <h2>{label}</h2>}
    </a>
  );
}
