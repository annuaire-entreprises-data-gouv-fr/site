import styles from "./styles.module.css";

export const Loader = () => (
  <span role="status">
    <span className="fr-sr-only">Chargement en cours</span>
    <span aria-hidden="true" className={styles.loader}>
      <span />
      <span />
      <span />
    </span>
  </span>
);
