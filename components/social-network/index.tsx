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
      <style jsx>{`
        h2.fr-h5 {
          font-size: 1.2rem !important;
        }
      `}</style>
    </div>
  </PrintNever>
);

export default SocialNetworks;
