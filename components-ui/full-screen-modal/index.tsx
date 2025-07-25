'use client';

import ButtonClose from '#components-ui/button/button-close';
import FloatingModal from '#components-ui/floating-modal';
import { PrintNever } from '#components-ui/print-visibility';
import ClientOnly from '#components/client-only';
import React from 'react';
import styles from './styles.module.css';

export const FullScreenModal: React.FC<{
  children: React.ReactNode;
  isVisible: boolean;
  modalId: string;
  onClose: () => void;
}> = ({ children, isVisible, modalId, onClose }) => {
  return (
    <ClientOnly>
      {isVisible ? (
        <PrintNever>
          <div className={styles.modalOverlay} onClick={onClose}>
            <FloatingModal
              id={modalId}
              role="dialog"
              elevation="high"
              className={styles.fullScreenModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.closeButton}>
                <ButtonClose
                  onClick={onClose}
                  ariaControls={modalId}
                  ariaLabel="Fermer la modale de bienvenue"
                />
              </div>
              {children}
            </FloatingModal>
          </div>
        </PrintNever>
      ) : null}
    </ClientOnly>
  );
};
