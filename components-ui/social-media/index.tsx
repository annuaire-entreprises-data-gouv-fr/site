import type React from "react";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { PrintNever } from "#components-ui/print-visibility";
import type { Siren } from "#utils/helpers";
import PrintButton from "./print-button";
import styles from "./styles.module.css";

const SocialMedia: React.FC<{
  path: string;
  label: string;
  siren?: Siren;
}> = ({ path, label, siren }) => (
  <PrintNever>
    <div className={styles.socialMedia + " layout-right"}>
      <span>
        <InformationTooltip
          ariaRelation="labelledby"
          horizontalOrientation="right"
          label="Partager cette page sur Linkedin"
          tabIndex={undefined}
        >
          <a
            className="no-style-link"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${path}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            <Icon slug="linkedin" />
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip
          ariaRelation="labelledby"
          horizontalOrientation="right"
          label="Partager cette page par Email"
          tabIndex={undefined}
        >
          <a
            className="no-style-link"
            href={`mailto:?subject=A découvrir sur l’Annuaire des Entreprises, la page de ${label}&body=Je voudrais partager la page ${label} avec vous ${path}`}
          >
            <Icon slug="mail" />
          </a>
        </InformationTooltip>
      </span>
      {siren && (
        <span>
          <InformationTooltip
            ariaRelation="describedby"
            horizontalOrientation="right"
            label="Télécharger un QR Code à inclure dans un courier ou dans un devis, pour partager cette page"
            tabIndex={undefined}
          >
            <a
              aria-label="Partager cette page grâce à un QR Code"
              className="no-style-link"
              download={`QR_code_page_${siren}.jpeg`}
              href={`/api/share/qr/${siren}`}
            >
              <Icon slug="qrCode" />
            </a>
          </InformationTooltip>
        </span>
      )}
      <span>
        <PrintButton />
      </span>
    </div>
  </PrintNever>
);

export default SocialMedia;
