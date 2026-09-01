import { Link } from "@tanstack/react-router";
import styles from "./leave-fondation.module.css";

export function LeaveFondation() {
  return (
    <div className={styles.leaveFondations}>
      <div className="fr-container">
        <Link to="/">
          ← Quitter les Fondations et revenir sur l'Annuaire des Entreprises
        </Link>
      </div>
    </div>
  );
}
