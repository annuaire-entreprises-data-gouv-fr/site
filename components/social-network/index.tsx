import { PrintNever } from '#components-ui/print-visibility';
import styles from './styles.module.scss';

const SocialNetworks = () => (
  <PrintNever>
    <div className="fr-follow">
      <div className="fr-container">
        <div className="fr-grid-row">
          <div className="fr-col-12">
            <div className="fr-follow__social">
              <b className="fr-h5 text">
                Retrouvez-nous sur les réseaux sociaux
              </b>
              <ul className="fr-btns-group">
                <li>
                  <a
                    className="fr-btn--twitter fr-btn"
                    href="https://twitter.com/_DINUM"
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Page twitter de la DINUM"
                  >
                    twitter
                  </a>
                </li>
                <li>
                  <a
                    className="fr-btn--linkedin fr-btn"
                    href="https://www.linkedin.com/company/annuaire-des-entreprises"
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Page linkedin de l’Annuaire des Entreprises"
                  >
                    linkedin
                  </a>
                </li>
                <li>
                  <a
                    className="fr-btn--github fr-btn"
                    href="https://github.com/etalab/annuaire-entreprises-site"
                    target="_blank"
                    rel="noreferrer noopener"
                    title="Page github de l’Annuaire des Entreprises"
                  >
                    github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PrintNever>
);

export default SocialNetworks;
