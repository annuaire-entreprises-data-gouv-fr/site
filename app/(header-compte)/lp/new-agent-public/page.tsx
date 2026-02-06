import type { Metadata } from "next";
import { default as ButtonProConnect } from "#components-ui/button-pro-connect";
import { Icon } from "#components-ui/icon/wrapper";
import { Tag } from "#components-ui/tag";
import constants from "#models/constants";
import styles from "./style.module.css";

export const metadata: Metadata = {
  title: "Espace agent | L’Annuaire des Entreprises",
  description: "L’annuaire de référence pour toutes les données d’entreprise.",
  robots: "index, follow",
  alternates: {
    canonical: "https://annuaire-entreprises.data.gouv.fr/lp/new-agent-public",
  },
};

const NewLandingPageAgent = () => (
  <div className={styles["page"]}>
    <section className={styles["hero"]}>
      <div className={styles["hero-content"]}>
        <h1>
          L’Annuaire de référence pour
          <br />
          toutes les données d’entreprise
        </h1>
        <p className="fr-text--lead">
          Accédez aux données essentielles pour vos missions
          <br />
          et prenez vos décisions en toute confiance.
        </p>
        <div className={styles["hero-cta"]}>
          <ButtonProConnect
            event="BTN_LP_HERO"
            noFootLink
            shouldRedirectToReferer
          />
        </div>
      </div>

      <div className={styles["video-placeholder"]}>
        <div className={styles["video-label"]}>
          Aperçu de l’espace agent public (vidéo à venir)
        </div>
        <button
          aria-label="Lecture de la vidéo de présentation (bientôt disponible)"
          className={styles["play-button"]}
          disabled
          type="button"
        >
          ▶
        </button>
      </div>
    </section>

    <section className={styles["data-section"]}>
      <h2>
        Toutes les données des entreprises et des associations, au même endroit.
      </h2>
      <p className="fr-text--lg">
        Plus besoin de redemander les pièces justificatives et les documents aux
        entreprises, tout est déjà dans l’Annuaire des Entreprises.
      </p>

      <div className={styles["data-card-shell"]}>
        <div className={styles["data-card"]}>
          <div className="fr-grid-row fr-grid-row--gutters">
            <div
              className={`fr-col-12 fr-col-md-3 ${styles["illustration-col"]}`}
            />

            <div className="fr-col-12 fr-col-md-9">
              <div className={styles["data-card-header"]}>
                <h3>Données accessibles via l’Annuaire des Entreprises</h3>
                <p>
                  Cette liste s’adapte à votre mission et vos habilitations
                  juridiques.
                </p>
                <a
                  href={constants.links.documentation.habilitation}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  Tout savoir sur les habilitations
                </a>
              </div>
            </div>
          </div>

          <div
            className={`fr-grid-row fr-grid-row--gutters ${styles["data-card-content"]}`}
          >
            <div
              className={`fr-col-12 fr-col-md-3 ${styles["illustration-col"]}`}
            >
              <img
                alt=""
                className={styles["data-illustration"]}
                src="/images/lp-agent/illu_locked_files.svg"
              />
            </div>

            <div className="fr-col-12 fr-col-md-9">
              <div className="fr-grid-row fr-grid-row--gutters">
                <div className="fr-col-12 fr-col-md-6">
                  <h4>Identité & informations officielles</h4>
                  <ul>
                    <li>Dénomination, adresse etc.</li>
                    <li>N° TVA et EORI</li>
                    <li>Justificatifs d’existence</li>
                    <li>Annonces légales</li>
                    <li>Données des non-diffusibles</li>
                    <li>
                      Effectifs annuels <HabilitationTag />
                    </li>
                    <li>
                      Liens capitalistiques <HabilitationTag />
                    </li>
                  </ul>

                  <h4>Documents et conformité des entreprises</h4>
                  <ul>
                    <li>Documents et actes au RNE (PDF)</li>
                    <li>
                      Conformité fiscale, sociale et MSA <HabilitationTag />
                    </li>
                  </ul>

                  <h4>Comptes et bilans</h4>
                  <ul>
                    <li>Comptes de résultats</li>
                    <li>Bilans au RNE</li>
                    <li>
                      Chiffres d’affaires <HabilitationTag />
                    </li>
                    <li>
                      Liasses fiscales <HabilitationTag />
                    </li>
                    <li>
                      Bilans de la Banque de France <HabilitationTag />
                    </li>
                    <li>
                      Registre des Bénéficiaires Effectifs <HabilitationTag />
                    </li>
                  </ul>
                </div>

                <div className="fr-col-12 fr-col-md-6">
                  <h4>Qualité et labels</h4>
                  <ul>
                    <li>Qualibat, OPQIBI, Qualifelec</li>
                    <li>Label entreprise inclusive</li>
                    <li>Qualiopi, BIO et RGE</li>
                    <li>Index Egapro</li>
                    <li>Qualité ESS</li>
                    <li>
                      Travaux publics (CIBTP, CNETP, ProBTP, FNTP){" "}
                      <HabilitationTag />
                    </li>
                  </ul>

                  <h4>Dirigeant(es)</h4>
                  <ul>
                    <li>Noms des dirigeant(es)</li>
                    <li>Date de naissance des dirigeant(es)</li>
                    <li>Comparaison des dirigeants RCS/RNE</li>
                    <li>Élus et dirigeants d’administration</li>
                  </ul>

                  <h4>Associations</h4>
                  <ul>
                    <li>Dirigeant(es) des associations</li>
                    <li>Documents des associations (PDF)</li>
                    <li>Subventions des associations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles["data-card-footer"]}>
          <p>
            Pour accéder aux données, il ne reste plus qu’à vous connecter !
          </p>
          <ButtonProConnect event="BTN_LP_HERO" />
        </div>
      </div>
    </section>
  </div>
);

const HabilitationTag = () => (
  <span className={styles["habilitation-tag"]}>
    <Tag color="agent" size="small">
      <Icon slug="lockFill">Sous habilitation</Icon>
    </Tag>
  </span>
);

export default NewLandingPageAgent;
