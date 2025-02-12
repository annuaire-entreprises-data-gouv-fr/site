import { PrintNever } from '#components-ui/print-visibility';

const SocialNetworks = () => (
  <PrintNever>
    <div className="fr-follow">
      <div className="fr-container">
        <div className="fr-grid-row">
          <div className="fr-col-12">
            <div className="fr-follow__social">
              <strong className="fr-h5">
                Retrouvez-nous sur les réseaux sociaux
              </strong>
              <ul className="fr-btns-group">
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
                    href="https://github.com/annuaire-entreprises-data-gouv-fr/site"
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
