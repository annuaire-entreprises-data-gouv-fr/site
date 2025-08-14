'use client';

import ClientOnly from '#components/client-only';
import { useStorage } from '#hooks/use-storage';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

const INFOBOX_ID = 'infobox_sirene';

export default function InfoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered] = useStorage(
    'local',
    INFOBOX_ID,
    false
  );

  useEffect(() => {
    if (!hasAlreadyBeenTriggered) {
      setIsVisible(true);
    }
  }, [hasAlreadyBeenTriggered, setHasAlreadyBeenTriggered]);

  const close = () => {
    setHasAlreadyBeenTriggered(true);
    setIsVisible(false);
  };

  return (
    <ClientOnly>
      {isVisible ? (
        <div className={styles.infoSection}>
          <div className={styles.infoSectionHeader}>
            <div></div>
            <button onClick={close}>
              <strong>Ne plus afficher ce message ✕</strong>
            </button>
          </div>
          <div>
            Constituez une liste d’établissements en combinant plusieurs
            critères de recherche à partir du répertoire Sirene.
          </div>
          <div>
            Les données sont mises à jour chaque jour et disponibles 24h après
            leur actualisation dans le répertoire Sirene.
          </div>
          <div>
            🚨 Ne figurent pas dans les listes :
            <ul>
              <li>
                Le nom des dirigeants, l’adresse e-mail, le site web et le
                numéro de téléphone
              </li>
              <li>
                Certaines informations non accessibles au public pour les unités
                en diffusion partielle
              </li>
            </ul>
          </div>
          <div>
            💡 Pour plus de détails sur le contenu des fichiers, consultez la{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://www.data.gouv.fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret"
            >
              documentation{' '}
            </a>{' '}
            et ce{' '}
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://guides.data.gouv.fr/reutiliser-des-donnees/guide-traitement-et-analyse-de-donnees/manipuler-des-donnees/ouvrir-des-donnees"
            >
              guide d’utilisation des fichiers CSV
            </a>
            .
          </div>
        </div>
      ) : null}
    </ClientOnly>
  );
}
