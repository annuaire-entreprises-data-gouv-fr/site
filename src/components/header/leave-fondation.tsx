import { Link } from "@tanstack/react-router";
import styles from "./leave-fondation.module.css";

export function LeaveFondation() {
  return (
    <div className={styles.leaveFondations}>
      <div className="fr-container">
        <Link to="/">
          ← Quitter la recherche thématique « fonds et fondations » et revenir à
          la recherche d'entreprises
        </Link>
      </div>
    </div>
  );
}
