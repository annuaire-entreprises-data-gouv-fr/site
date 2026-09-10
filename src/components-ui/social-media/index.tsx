import { clsx } from "clsx";
import type React from "react";
import { Icon } from "#/components-ui/icon/wrapper";
import InformationTooltip from "#/components-ui/information-tooltip";
import { PrintNever } from "#/components-ui/print-visibility";
import PrintButton from "./print-button";
import { QrCode } from "./qr-code";
import styles from "./styles.module.css";

const SocialMedia: React.FC<{
  path: string;
  label: string;
  id: string;
}> = ({ path, label, id }) => (
  <PrintNever>
    <div className={clsx(styles.socialMedia, "layout-right")}>
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
      <QrCode id={id} />
      <span>
        <PrintButton />
      </span>
    </div>
  </PrintNever>
);

export default SocialMedia;
