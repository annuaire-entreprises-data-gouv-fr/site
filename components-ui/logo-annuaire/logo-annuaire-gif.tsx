import styles from './styles.module.css';

export const diamond = (
  <svg
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 53 61"
    width="100"
    height="100"
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
export const LogoAnnuaireGif = () => (
  <div className={styles.logoAnnuaire}>
    <img src="/images/annuaire-entreprises-paysage-large.gif" />
  </div>
);
