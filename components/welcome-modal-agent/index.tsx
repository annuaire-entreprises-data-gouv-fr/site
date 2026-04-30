"use client";

import clsx from "clsx";
import { useStorage } from "hooks";
import type React from "react";
import { useEffect, useState } from "react";
import { Icon } from "#components-ui/icon/wrapper";
import constants from "#models/constants";
import { Modal } from "../../components-ui/modal";
import styles from "./styles.module.css";

const MODAL_ID = "welcome-modal-agent";
const USAGE_MODAL_ID = "usage-welcome-modal-agent";

export const WelcomeModalAgent: React.FC = () => {
  const [isInitialWelcomeModalVisible, setIsInitialWelcomeModalVisible] =
    useState(false);
  const [isUsageWelcomeModalVisible, setIsUsageWelcomeModalVisible] =
    useState(false);
  const [hasSeenInitialWelcomeModal, setHasSeenInitialWelcomeModal] =
    useStorage("local", MODAL_ID, false);
  const [hasSeenUsageWelcomeModal, setHasSeenUsageWelcomeModal] = useStorage(
    "cookie",
    USAGE_MODAL_ID,
    false,
    {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days
    }
  );

  useEffect(() => {
    if (!hasSeenInitialWelcomeModal) {
      setIsInitialWelcomeModalVisible(true);
      setHasSeenInitialWelcomeModal(true);
    } else if (!hasSeenUsageWelcomeModal) {
      setIsUsageWelcomeModalVisible(true);
      setHasSeenUsageWelcomeModal(true);
    }
  }, [hasSeenInitialWelcomeModal, setHasSeenInitialWelcomeModal]);

  return (
    <>
      <Modal
        isVisible={isInitialWelcomeModalVisible}
        modalId={MODAL_ID}
        onClose={() => setIsInitialWelcomeModalVisible(false)}
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
            Pour bien commencer, nous vous invitons à découvrir l’outil en
            lisant{" "}
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
          onClick={() => setIsInitialWelcomeModalVisible(false)}
          style={{ marginTop: 10 }}
          type="button"
        >
          Continuer ma navigation
        </button>
      </Modal>
      <Modal
        isVisible={isUsageWelcomeModalVisible}
        modalId={USAGE_MODAL_ID}
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
              onClick={() => setIsInitialWelcomeModalVisible(false)}
              style={{ marginTop: 10 }}
              type="button"
            >
              J'ai compris
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
