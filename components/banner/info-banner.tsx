import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import { INSEE } from '#components/administrations';
import constants from '#models/constants';

export const InfoBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      className="info-banner"
      role="dialog"
      aria-label="Instabilité des services de nos partenaires"
      style={{
        paddingTop: '15px',
        paddingBottom: '15px',
        width: '100%',
        backgroundColor: '#e5f3ff',
        borderBottom: `2px solid ${constants.colors.frBlue}`,
      }}
    >
      <div className="fr-container">
        ℹ️ Suite à la mise à jour{' '}
        <a href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/">
          de la base Sirene
        </a>{' '}
        de l’
        <INSEE />, les données sont désormais à jour à l’exception de la qualité
        Société à mission.
      </div>
    </div>
  </PrintNever>
);
