'use client';

import styles from './styles.module.css';

export default function InfoSection() {
  return (
    <div className={styles.infoSection}>
      <div>
        Constituez une liste d’établissements en combinant plusieurs critères de
        recherche à partir du répertoire Sirene.
      </div>
      <div>
        Les données sont mises à jour chaque jour et disponibles 24h après leur
        actualisation dans le répertoire Sirene.
      </div>
      <div>
        🚨 À noter que nos listes ne contiennent pas :
        <ul style={{ paddingLeft: 35 }}>
          <li>
            le nom des dirigeants, l’adresse e-mail, le site web ni le numéro de
            téléphone
          </li>
          <li>
            certaines informations non accessibles au public pour les unités en
            diffusion partielle
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
  );
}
