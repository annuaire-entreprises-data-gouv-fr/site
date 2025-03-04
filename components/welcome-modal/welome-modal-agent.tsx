import constants from '#models/constants';
import React from 'react';
import { WelcomeModal } from '.';
import styles from './styles.module.css';

export const WelcomeModalAgent: React.FC = () => {
  return (
    <WelcomeModal
      title="Bienvenue sur l'espace agent ! 👋"
      modalId="welcome-modal-agent"
    >
      <div className={styles.linksContainer}>
        <h3>Pour commencer :</h3>
        <ul>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Gestion de mon compte agent public"
              href={'/compte'}
            >
              Consulter vos droits
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Documentation de l’espace agent public"
              href={constants.links.documentation}
            >
              Consulter la documentation
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Canal Tchap"
              href={constants.links.tchap}
            >
              Rejoindre la communauté Tchap
            </a>
          </li>
        </ul>
      </div>
    </WelcomeModal>
  );
};
