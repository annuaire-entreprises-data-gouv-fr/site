import { Icon } from '#components-ui/icon/wrapper';
import constants from '#models/constants';
import styles from './style.module.css';

export const AdvancedSearchTutorial = () => {
  return (
    <div className={styles['advanced-search-tutorial']}>
      <svg
        fill="#c53721"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-41.5 -41.5 498.3 498.3"
        transform="matrix(0 -1 -1 0 0 0)"
        stroke="#c53721"
        strokeWidth="0"
        style={{ height: '100px', position: 'absolute', top: '-20px' }}
      >
        <g stroke="none">
          <path d="M415 375c-8-24.5-20.3-47.8-30.7-71-1.2-3-6-3-8-1.2-10.3 11-22 22-28.7 35.5h-.6c-74.7 5.5-146.9-58.2-198.3-104.7C89.4 180.4 35.5 115.5 14.1 37.8c-1.2-9.8-2.5-20.2-2.5-30.6 0-5-6.7-5-7.3 0v5.5c-2.5 0-4.3 1.8-4.3 4.9.6 6.7 2.4 13.4 3.7 20.2 4.9 165.8 170.1 325.6 331.7 336-5.5 9.8-10.4 20.2-16.5 30-3.1 4.2 1.8 8.5 6 7.9 30.7-4.3 58.2-19 86.4-30 2.4-.6 4.9-3 3.6-6.7zm-82 24.5c3.6-8 6-16 10.3-23.9 1.3-3-.6-5.5-2.4-6.1 0-1.9-1.2-3-3-3.7-146.3-24.5-265-124.2-309.1-259.5 28.7 53.3 72.8 99.8 116.2 139A614.4 614.4 0 0 0 247.2 321c28.8 16.6 65 31.9 98 21.4-1.9 5 5.5 7.4 8 3.7a389 389 0 0 1 24.4-29.4c8.6 19 17.8 38 24.5 57.6-22.7 8.5-45.3 19.6-69.2 25z" />
        </g>
      </svg>
      <br />
      <div>
        <div className={styles.title}>
          Grâce aux filtres de recherche, retrouvez n’importe quelle entreprise,
          association, ou administration en France.
        </div>
        <div>
          <ul>
            <li>
              <Icon color={constants.colors.frBlue} slug="mapPin">
                <strong>Zone géographique&nbsp;:</strong>&#8200;filtrez par
                ville, département ou région
              </Icon>
            </li>
            <li>
              <Icon color={constants.colors.frBlue} slug="user">
                <strong>Dirigeant&nbsp;:</strong>&#8200;filtrez par le nom ou le
                prénom d’un(e) dirigeant(e)
              </Icon>
            </li>
            <li>
              <Icon color={constants.colors.frBlue} slug="building">
                <strong>Structure&nbsp;:</strong>&#8200;filtrez par type de
                structure ou labels (ESS, Société à mission, Entreprise
                Inclusive, RGE, Spectacle vivant, Qualiopi, Bio)
              </Icon>
            </li>
            <li>
              <Icon color={constants.colors.frBlue} slug="moneyCircle">
                <strong>Financier&nbsp;:</strong>&#8200;filtrez par chiffre
                d’affaires ou résultat net
              </Icon>
            </li>
            <li>
              <Icon color={constants.colors.frBlue} slug="file">
                <strong>Situation administrative&nbsp;:</strong>&#8200;filtrez
                par domaine d’activité, état administratif (En activité/Cessée)
                ou taille d’entreprise
              </Icon>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
