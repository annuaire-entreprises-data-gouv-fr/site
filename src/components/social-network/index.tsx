import { PrintNever } from "#/components-ui/print-visibility";

const SocialNetworks = () => (
  <PrintNever>
    <div className="fr-follow">
      <div className="fr-container">
        <div className="fr-grid-row">
          <div className="fr-col-12">
            <div className="fr-follow__social">
              <h2 className="fr-h5">Retrouvez-nous sur les réseaux sociaux</h2>
              <ul className="fr-btns-group">
                <li>
                  <a
                    aria-label="linkedin de l’Annuaire des Entreprises — nouvelle fenêtre"
                    className="fr-btn--linkedin fr-btn"
                    href="https://www.linkedin.com/company/annuaire-des-entreprises"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    linkedin
                  </a>
                </li>
                <li>
                  <a
                    aria-label="github de l’Annuaire des Entreprises — nouvelle fenêtre"
                    className="fr-btn--github fr-btn"
                    href="https://github.com/annuaire-entreprises-data-gouv-fr/site"
                    rel="noreferrer noopener"
                    target="_blank"
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
