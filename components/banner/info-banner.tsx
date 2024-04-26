import React from 'react';
import { Icon } from '#components-ui/icon/wrapper';
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
        paddingTop: '10px',
        paddingBottom: '5px',
        width: '100%',
        backgroundColor: '#e5f3ff',
        borderBottom: `2px solid ${constants.colors.frBlue}`,
        fontSize: '0.9rem',
      }}
    >
      <div className="fr-container">
        <Icon slug="information" color={constants.colors.frBlue} size={14}>
          Suite à la mise à jour{' '}
          <a href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/">
            de la base Sirene
          </a>{' '}
          de l’
          <INSEE />, les données des sociétés à mission sont temporairement
          manquantes.
        </Icon>
      </div>
    </div>
  </PrintNever>
);
