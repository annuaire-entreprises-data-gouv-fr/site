import React from 'react';
import { Info } from '#components-ui/alerts';
import { PrintNever } from '#components-ui/print-visibility';
import { INSEE } from '#components/administrations';

export const SocieteAMissionBanner: React.FC<{}> = () => (
  <PrintNever>
    <Info>
      <div
        className="info-banner"
        role="dialog"
        aria-label="Instabilité des services de nos partenaires"
      >
        Suite à la mise à jour{' '}
        <a href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/">
          de la base Sirene
        </a>{' '}
        de l’
        <INSEE />, les données des{' '}
        <a
          href="/definitions/societe-a-mission"
          aria-label="Voir la définition d'une société à mission"
        >
          sociétés à mission
        </a>{' '}
        sont temporairement manquantes .
      </div>
    </Info>
  </PrintNever>
);
