import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import styles from './styles.module.css';

export const NPSBanner: React.FC<{}> = () => {
  return (
    <PrintNever>
      <div
        id="nps-modal-2"
        role="dialog"
        aria-label="Donnez-nous votre avis"
        className={styles.npsModal}
      >
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: `
              <a onclick="window.closeModal('nps-modal-2')" href="/formulaire/nps" target="_blank">
                👍👎 Quel est votre avis sur ce site ?
              </a>`,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: `
              <button onclick="window.closeModal('nps-modal-2')" style="box-shadow:none;font-family: 'Marianne', sans-serif;padding: 0;outline: none;border: none;background-color: transparent;">
                <strong>Ne plus afficher ce message ✕</strong>
              </button>
        `,
            }}
          ></div>
        </div>
      </div>
    </PrintNever>
  );
};
