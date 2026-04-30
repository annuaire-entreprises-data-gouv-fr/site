"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Modal } from "#components-ui/modal";
import constants from "#models/constants";
import { INITIAL_WELCOME_MODAL_ID } from "./constants";
import {
  useHasSeenDataAccessReminderModal,
  useHasSeenInitialWelcomeModal,
} from "./storage";

const useInitialWelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasSeenWelcomeModal, setHasSeenWelcomeModal] =
    useHasSeenInitialWelcomeModal();
  const [_, setHasSeenDataAccessReminderModal] =
    useHasSeenDataAccessReminderModal();

  useEffect(() => {
    if (hasSeenWelcomeModal) {
      return;
    }

    setIsVisible(true);
    setHasSeenWelcomeModal(true);
    setHasSeenDataAccessReminderModal(true);
  }, [hasSeenWelcomeModal, setHasSeenWelcomeModal]);

  return {
    close: () => setIsVisible(false),
    isVisible,
  };
};

export const InitialWelcomeModal: React.FC = () => {
  const { close, isVisible } = useInitialWelcomeModal();

  return (
    <Modal
      isVisible={isVisible}
      modalId={INITIAL_WELCOME_MODAL_ID}
      onClose={close}
    >
      <div className="layout-center">
        <img
          alt=""
          height="150px"
          src="/images/lp-agent/secure-folder 1.svg"
          width="150px"
        />
      </div>
      <strong>Bonjour et bienvenue sur l’espace agent 👋</strong>
      <div style={{ textAlign: "left" }}>
        <p>
          Pour bien commencer, nous vous invitons à découvrir l’outil en lisant{" "}
          <a
            aria-label="Documentation de l’espace agent public"
            href={constants.links.documentation.home}
            rel="noopener noreferrer"
            target="_blank"
          >
            la documentation
          </a>
          .
        </p>
        <p>
          Si vous avez des questions, n’hésitez pas à{" "}
          <a
            aria-label="Canal Tchap"
            href={constants.links.tchap}
            rel="noopener noreferrer"
            target="_blank"
          >
            nous rejoindre sur Tchap
          </a>{" "}
          et nous les poser.
        </p>
      </div>
      <button
        className="fr-btn fr-btn--primary"
        onClick={close}
        style={{ marginTop: 10 }}
        type="button"
      >
        Continuer ma navigation
      </button>
    </Modal>
  );
};
