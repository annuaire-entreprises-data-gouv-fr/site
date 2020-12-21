import React from 'react';
import ButtonLink from '../button';

export const NPSModal: React.FC<{}> = () => (
  <>
    <div id="nps-modal">
      <div className="rf-container">
        <ButtonLink alt href="/test" target="_blank">
          👍👎 Quel-est votre avis sur ce site ?
        </ButtonLink>
        {/* @ts-ignore */}
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <button style="font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;" onclick="window.closeNPSModal()">
                Ne plus afficher ce message ✕
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
        width: 100%;
        background-color: #fffde6;
        font-family: 'Marianne', sans-serif;
      }
      #nps-modal {
        position: fixed;
        bottom: 0;
        border-top: 2px solid #000091;
        z-index: 100;
      }
      #nps-modal .rf-container {
        display: flex;
        justify-content: space-between;
      }
      #nps-modal .rf-container button {
        f
      }
    `}</style>
  </>
);
