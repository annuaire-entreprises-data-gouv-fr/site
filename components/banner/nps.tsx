import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import styles from './styles.module.scss';

export const NPSBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      className={`${styles['nps-modal']}`}
      id="nps-modal"
      role="dialog"
      aria-label="Donnez-nous votre avis"
    >
      <div className="fr-container">
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <a onclick="window.closeModal('nps-modal')"  href="/formulaire/nps" target="_blank">
                👍👎 Quel est votre avis sur ce site ?
              </a>`,
          }}
        />
        <div
          dangerouslySetInnerHTML={{
            __html: `
              <button onclick="window.closeModal('nps-modal')" style="box-shadow:none;font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;">
                <b>Ne plus afficher ce message ✕</b>
              </button>
        `,
          }}
        ></div>
      </div>
    </div>
  </PrintNever>
);
