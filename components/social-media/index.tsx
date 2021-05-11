import React from 'react';
import { facebook, linkedin, qrCode, twitter } from '../icon';
import InformationTooltip from '../information-tooltip';

const SocialMedia: React.FC<{ siren: string }> = ({ siren }) => (
  <>
    <div className="social-media layout-right">
      <span>
        <InformationTooltip
          orientation="right"
          label="Partager la page de cette entreprise sur Linkedin"
        >
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
        <InformationTooltip
          orientation="right"
          label="Partager la page de cette entreprise sur Twitter"
        >
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
        <InformationTooltip
          orientation="right"
          label="Partager la page de cette entreprise sur Facebook"
        >
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
        <InformationTooltip
          label="Télécharger un QR Code à inclure dans un courier ou dans un devis, pour partager cet url."
          orientation="right"
        >
          <a href={`/api/qr/${siren}`} download={`QR_code_page_${siren}.jpeg`}>
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
      .social-media span a:after {
        display: none;
      }
      .social-media {
        color: #000091;
        margin: 0 0 12px 0;
      }
    `}</style>
  </>
);

export default SocialMedia;
