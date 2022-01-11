import React from 'react';
import { PrintNever } from '../print-visibility';

export const NPSBanner: React.FC<{}> = () => (
  <PrintNever>
    <div id="nps-modal" role="dialog" aria-label="Donnez-nous votre avis">
      <div className="fr-container">
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <a onclick="window.closeNPSModal()"  href="https://form.typeform.com/to/ehxbMpeX" target="_blank">
                👍👎 Quel est votre avis sur ce site ?
              </a>`,
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <button onclick="window.closeNPSModal()" style="box-shadow:none;font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;">
                <b>Ne plus afficher ce message ✕</b>
              </button>
        `,
          }}
        ></div>
      </div>
    </div>
    <style jsx>{`
      #nps-modal {
        display: none;
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 0.9rem;
        width: 100%;
        background-color: #fffde6;
        font-family: 'Marianne', sans-serif;
        border-bottom: 2px solid #000091;
      }
      #nps-modal .fr-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `}</style>
  </PrintNever>
);
