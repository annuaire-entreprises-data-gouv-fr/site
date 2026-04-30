"use client";

import clsx from "clsx";
import type React from "react";
import { useEffect, useState } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import { Modal } from "#components-ui/modal";
import constants from "#models/constants";
import { DATA_ACCESS_REMINDER_MODAL_ID } from "./constants";
import {
  useHasSeenDataAccessReminderModal,
  useHasSeenInitialWelcomeModal,
} from "./storage";
import styles from "./styles.module.css";

const useDataAccessReminderModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenInitialWelcomeModal] = useHasSeenInitialWelcomeModal();
  const [hasSeenDataAccessReminderModal, setHasSeenDataAccessReminderModal] =
    useHasSeenDataAccessReminderModal();

  useEffect(() => {
    if (!hasSeenInitialWelcomeModal || hasSeenDataAccessReminderModal) {
      return;
    }

    setIsVisible(true);
    setHasSeenDataAccessReminderModal(true);
  }, [
    hasSeenDataAccessReminderModal,
    hasSeenInitialWelcomeModal,
    setHasSeenDataAccessReminderModal,
  ]);

  return {
    close: () => setIsVisible(false),
    isVisible,
  };
};

export const DataAccessReminderModal: React.FC = () => {
  const { close, isVisible } = useDataAccessReminderModal();

  return (
    <Modal
      isVisible={isVisible}
      modalId={DATA_ACCESS_REMINDER_MODAL_ID}
      size="small"
      textAlign="left"
    >
      <div className="fr-grid-row">
        <div className={clsx("fr-col-2", styles.modalLeftColumn)}>
          <Icon color={constants.colors.frBlue} size={48} slug="shieldFill" />
        </div>
        <div className="fr-col-10">
          <strong>Utilisation responsable des données ✨</strong>
          <div style={{ textAlign: "left" }}>
            <p>
              En tant qu’agent, vous avez accès à des données confidentielles.
              <br />
              Utilisez-les prudemment et uniquement dans le cadre de vos
              missions.
            </p>
          </div>
          <button
            className="fr-btn fr-btn--secondary"
            onClick={close}
            style={{ marginTop: 10 }}
            type="button"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </Modal>
  );
};
