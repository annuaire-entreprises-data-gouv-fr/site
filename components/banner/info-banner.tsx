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
        ⚠️ Une mise à jour <INSEE /> est en cours et les données <a href="https://www.data.gouv.fr/fr/datasets/base-sirene-des-entreprises-et-de-leurs-etablissements-siren-siret/">de la base Sirene</a> n’ont pas été mises à jour sur notre site depuis le 22 mars 2024.
        <br />
        Cette situation est susceptible de perdurer jusqu’à ce que les données soient disponibles. Veuillez nous excuser pour la gêne occasionnée.
      </div>
    </div>
  </PrintNever>
);
