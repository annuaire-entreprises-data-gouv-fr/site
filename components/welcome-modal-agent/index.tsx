"use client";

import { useStorage } from "hooks";
import type React from "react";
import { useEffect, useState } from "react";
import constants from "#models/constants";
import { FullScreenModal } from "../../components-ui/full-screen-modal";

const MODAL_ID = "welcome-modal-agent";

export const WelcomeModalAgent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered] = useStorage(
    "local",
    MODAL_ID,
    false
  );

  useEffect(() => {
    if (!hasAlreadyBeenTriggered) {
      setIsVisible(true);
      setHasAlreadyBeenTriggered(true);
    }
  }, [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered]);

  return (
    <FullScreenModal
      isVisible={isVisible}
      modalId={MODAL_ID}
      onClose={() => setIsVisible(false)}
    >
      <div className="layout-center">
        <img alt="" height="150px" src="/images/lp-agent/secure-folder 1.svg" />
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
        onClick={() => setIsVisible(false)}
        style={{ marginTop: 10 }}
      >
        Continuer ma navigation
      </button>
    </FullScreenModal>
  );
};
