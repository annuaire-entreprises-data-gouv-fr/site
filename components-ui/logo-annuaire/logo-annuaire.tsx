import styles from "./styles.module.css";

export const diamond = (
  <svg
    fill="none"
    height="100"
    viewBox="0 0 53 61"
    width="100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m26.5 0 26.4 15.3v30.4L26.5 61 .1 45.7V15.3L26.5 0Z"
      fill="currentColor"
    />
  </svg>
);
/**
 * Render website's logo using a mix of SVG and text, SEO good practises
 *
 * @returns
 */
export const LogoAnnuaire = () => (
  <div className={styles.logoAnnuaire}>
    <span>{diamond}</span>
    <h1>
      L’<strong>Annuaire</strong> des <br />
      <strong>Entreprises</strong>
    </h1>
  </div>
);

export const LogoAnnuaireGif = () => (
  <img
    alt="Logo de l’Annuaire des Entreprises"
    src="/images/annuaire-entreprises-paysage-large.gif"
    style={{ height: "100px", margin: "auto", display: "block" }}
  />
);
