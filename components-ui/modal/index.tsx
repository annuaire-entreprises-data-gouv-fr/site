"use client";

import clsx from "clsx";
import type React from "react";
import ClientOnly from "#components/client-only";
import ButtonClose from "#components-ui/button/button-close";
import FloatingModal from "#components-ui/floating-modal";
import { PrintNever } from "#components-ui/print-visibility";
import styles from "./styles.module.css";

export const Modal: React.FC<{
  size?: "small" | "medium" | "full";
  children: React.ReactNode;
  isVisible: boolean;
  modalId: string;
  textAlign?: "center" | "left";
  onClose?: () => void;
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
        {/* biome-ignore lint/a11y/noStaticElementInteractions: the overlay intentionally handles pointer dismissal for the modal */}
        {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: the overlay intentionally handles pointer dismissal for the modal */}
        <div
          className={styles.modalOverlay}
          onClick={onClose}
          onKeyDown={(event) => {
            if (onClose && (event.key === "Enter" || event.key === " ")) {
              onClose();
            }
          }}
        >
          <FloatingModal
            className={clsx(
              styles.fullScreenModal,
              !onClose && styles.fullScreenModalNoClose,
              size === "full" && styles.fullScreenModalFull,
              size === "small" && styles.fullScreenModalSmall
            )}
            elevation="high"
            id={modalId}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            style={{ textAlign }}
          >
            {onClose && (
              <div className={styles.closeButton}>
                <ButtonClose
                  ariaControls={modalId}
                  ariaLabel="Fermer la modale de bienvenue"
                  onClick={onClose}
                />
              </div>
            )}
            {children}
          </FloatingModal>
        </div>
      </PrintNever>
    ) : null}
  </ClientOnly>
);
