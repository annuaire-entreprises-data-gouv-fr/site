"use client";

import clsx from "clsx";
import type React from "react";
import ClientOnly from "#components/client-only";
import ButtonClose from "#components-ui/button/button-close";
import FloatingModal from "#components-ui/floating-modal";
import { PrintNever } from "#components-ui/print-visibility";
import styles from "./styles.module.css";

export const Modal: React.FC<{
  size?: "medium" | "full";
  children: React.ReactNode;
  isVisible: boolean;
  modalId: string;
  textAlign?: "center" | "left";
  onClose: () => void;
}> = ({
  size = "medium",
  children,
  isVisible,
  modalId,
  onClose,
  textAlign = "center",
}) => (
  <ClientOnly>
    {isVisible ? (
      <PrintNever>
        <div className={styles.modalOverlay} onClick={onClose}>
          <FloatingModal
            className={clsx(
              styles.fullScreenModal,
              size === "full" && styles.fullScreenModalFull
            )}
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
