'use client';

import ButtonClose from '#components-ui/button/button-close';
import FloatingModal from '#components-ui/floating-modal';
import { PrintNever } from '#components-ui/print-visibility';
import ClientOnly from '#components/client-only';
import { useStorage } from 'hooks';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const FullScreenModal: React.FC<{
  children: React.ReactNode;
  modalId: string;
}> = ({ children, modalId }) => {
  const [isVisible, setIsVisible] = useState(false);

  const [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered] = useStorage(
    'local',
    modalId,
    false
  );

  useEffect(() => {
    if (!hasAlreadyBeenTriggered) {
      setIsVisible(true);
      setHasAlreadyBeenTriggered(true);
    }
  }, [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered]);

  const close = () => {
    setIsVisible(false);
  };

  return (
    <ClientOnly>
      {isVisible ? (
        <PrintNever>
          <div className={styles.modalOverlay} onClick={close}>
            <FloatingModal
              id={modalId}
              role="dialog"
              elevation="high"
              className={styles.fullScreenModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.closeButton}>
                <ButtonClose
                  onClick={close}
                  ariaControls={modalId}
                  ariaLabel="Fermer la modale de bienvenue"
                />
              </div>
              {children}
              <button
                style={{ marginTop: 10 }}
                onClick={close}
                className="fr-btn fr-btn--primary"
              >
                Continuer ma navigation
              </button>
            </FloatingModal>
          </div>
        </PrintNever>
      ) : null}
    </ClientOnly>
  );
};
