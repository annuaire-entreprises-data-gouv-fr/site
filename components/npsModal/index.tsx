import React from 'react';
import ButtonLink from '../button';

export const NPSModal: React.FC<{}> = () => (
  <>
    <div id="nps-modal">
      <div className="rf-container">
        <a href="https://startupdetat.typeform.com/to/ehxbMpeX" target="_blank">
          👍👎 Donnez-nous votre avis sur ce site
        </a>
        {/* @ts-ignore */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <button style="font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;" onclick="window.closeNPSModal()">
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
      #nps-modal .rf-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    `}</style>
  </>
);
