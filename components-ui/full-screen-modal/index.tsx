"use client";

import type React from "react";
import ClientOnly from "#components/client-only";
import ButtonClose from "#components-ui/button/button-close";
import FloatingModal from "#components-ui/floating-modal";
import { PrintNever } from "#components-ui/print-visibility";
import styles from "./styles.module.css";

export const FullScreenModal: React.FC<{
  children: React.ReactNode;
  isVisible: boolean;
  modalId: string;
  textAlign?: "center" | "left";
  onClose: () => void;
}> = ({ children, isVisible, modalId, onClose, textAlign = "center" }) => (
  <ClientOnly>
    {isVisible ? (
      <PrintNever>
        <div className={styles.modalOverlay} onClick={onClose}>
          <FloatingModal
            className={styles.fullScreenModal}
            elevation="high"
            id={modalId}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{ textAlign }}
          >
            <div className={styles.closeButton}>
              <ButtonClose
                ariaControls={modalId}
                ariaLabel="Fermer la modale de bienvenue"
                onClick={onClose}
              />
            </div>
            {children}
          </FloatingModal>
        </div>
      </PrintNever>
    ) : null}
  </ClientOnly>
);
