import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { PrintNever } from '#components-ui/print-visibility';
import { Siren } from '#utils/helpers';
import React from 'react';
import PrintButton from './print-button';
import styles from './styles.module.css';

const SocialMedia: React.FC<{
  path: string;
  label: string;
  siren?: Siren;
}> = ({ path, label, siren }) => (
  <PrintNever>
    <div className={styles.socialMedia + ' layout-right'}>
      <span>
        <InformationTooltip
          ariaRelation="labelledby"
          tabIndex={undefined}
          horizontalOrientation="right"
          label="Partager cette page sur Linkedin"
        >
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${path}`}
            rel="noreferrer noopener"
            target="_blank"
            className="no-style-link"
          >
            <Icon slug="linkedin" />
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip
          ariaRelation="labelledby"
          tabIndex={undefined}
          horizontalOrientation="right"
          label="Partager cette page sur Twitter"
        >
          <a
            href={`https://twitter.com/intent/tweet?url=${path}`}
            rel="noreferrer noopener"
            target="_blank"
            className="no-style-link"
          >
            <Icon slug="twitter" />
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip
          ariaRelation="labelledby"
          tabIndex={undefined}
          horizontalOrientation="right"
          label="Partager cette page sur Facebook"
        >
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${path}`}
            rel="noreferrer noopener"
            target="_blank"
            // Hydration warning when using some extension
            suppressHydrationWarning
            className="no-style-link"
          >
            <Icon slug="facebook" />
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip
          ariaRelation="labelledby"
          tabIndex={undefined}
          horizontalOrientation="right"
          label="Partager cette page par Email"
        >
          <a
            href={`mailto:?subject=A découvrir sur l’Annuaire des Entreprises, la page de ${label}&body=Je voudrais partager la page ${label} avec vous ${path}`}
            className="no-style-link"
          >
            <Icon slug="mail" />
          </a>
        </InformationTooltip>
      </span>
      {siren && (
        <span>
          <InformationTooltip
            ariaRelation="describedby"
            tabIndex={undefined}
            label="Télécharger un QR Code à inclure dans un courier ou dans un devis, pour partager cette page"
            horizontalOrientation="right"
          >
            <a
              aria-label="Partager cette page grâce à un QR Code"
              href={`/api/share/qr/${siren}`}
              download={`QR_code_page_${siren}.jpeg`}
              className="no-style-link"
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
