import constants from '#models/constants';
import React from 'react';
import { FullScreenModal } from '../../components-ui/full-screen-modal';

export const WelcomeModalAgent: React.FC = () => {
  return (
    <FullScreenModal modalId="welcome-modal-agent">
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
            href={constants.links.documentation}
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
    </FullScreenModal>
  );
};
