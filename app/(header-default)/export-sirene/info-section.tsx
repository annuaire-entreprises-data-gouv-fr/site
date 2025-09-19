'use client';

import { Info } from '#components-ui/alerts';
import { INSEE } from '#components/administrations';

export default function InfoSection() {
  return (
    <div>
      <p>
        Constituez une <strong>liste d’établissements (maille SIRET)</strong> en
        combinant plusieurs critères de recherche à partir du répertoire Sirene
        tenu par l’
        <INSEE />.
      </p>
      <p>
        Les données sont mises à jour chaque jour et{' '}
        <strong>disponibles 24h après leur actualisation</strong> dans le
        répertoire Sirene.
      </p>
      <Info>
        Notez que les listes ne contiennent pas :
        <ul>
          <li>
            les noms de dirigeants, les adresses de courriel, les sites web, ni
            les numéros de téléphone
          </li>
          <li>
            certaines informations non accessibles au public pour les unités en
            diffusion partielle
          </li>
        </ul>
      </Info>
      <div>
        Pour plus de détails sur le contenu des fichiers, consultez la{' '}
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
