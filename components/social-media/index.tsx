import React from 'react';
import { facebook, linkedin, qrCode, twitter } from '../icon';
import InformationTooltip from '../information-tooltip';

const SocialMedia: React.FC<{ siren: string }> = ({ siren }) => (
  <>
    <div className="social-media layout-right">
      <span>
        <InformationTooltip label="Partager la page de cette entreprise sur Linkedin">
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {linkedin}
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip label="Partager la page de cette entreprise sur Twitter">
          <a
            href={`https://twitter.com/intent/tweet?url=https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {twitter}
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip label="Partager la page de cette entreprise sur Facebook">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=https://annuaire-entreprises.data.gouv.fr/entreprise/${siren}`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {facebook}
          </a>
        </InformationTooltip>
      </span>
      <span>
        <InformationTooltip label="Télécharger un QR Code à scanner pour retrouver cet url">
          <a
            href={`/api/qr/${siren}`}
            rel="noreferrer noopener"
            target="_blank"
            download={`QR_code_page_${siren}.jpeg`}
          >
            {qrCode}
          </a>
        </InformationTooltip>
      </span>
    </div>
    <style jsx>{`
      .social-media {
        color: #000091;
      }

      .social-media span {
        margin: 0 5px;
      }
      .social-media span a {
        cursor: pointer !important;
        box-shadow: none;
      }
    `}</style>
  </>
);

export default SocialMedia;
