import styles from './styles.module.scss';

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
export const HomeH1 = () => (
  <div className={styles['home-h1']}>
    <span>{diamond}</span>
    <h1>
      L’<b>Annuaire</b> des
      <br />
      <b>Entreprises</b>
    </h1>
  </div>
);
