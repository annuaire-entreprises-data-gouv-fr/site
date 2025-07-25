'use client';

import constants from '#models/constants';
import { useStorage } from 'hooks';
import React, { useEffect, useState } from 'react';
import { FullScreenModal } from '../../components-ui/full-screen-modal';

const MODAL_ID = 'welcome-modal-agent';

export const WelcomeModalAgent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered] = useStorage(
    'local',
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
      setIsVisible={setIsVisible}
      modalId={MODAL_ID}
    >
      <div className="layout-center">
        <img src="/images/lp-agent/secure-folder 1.svg" alt="" height="150px" />
      </div>
      <strong>Bonjour et bienvenue sur l’espace agent 👋</strong>
      <div style={{ textAlign: 'left' }}>
        <p>
          Pour bien commencer, nous vous invitons à découvrir l’outil en lisant{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Documentation de l’espace agent public"
            href={constants.links.documentation.home}
          >
            la documentation
          </a>
          .
        </p>
        <p>
          Si vous avez des questions, n’hésitez pas à{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Canal Tchap"
            href={constants.links.tchap}
          >
            nous rejoindre sur Tchap
          </a>{' '}
          et nous les poser.
        </p>
      </div>
      <button
        style={{ marginTop: 10 }}
        onClick={() => setIsVisible(false)}
        className="fr-btn fr-btn--primary"
      >
        Continuer ma navigation
      </button>
    </FullScreenModal>
  );
};
