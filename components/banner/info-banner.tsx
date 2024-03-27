import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
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
        ⚠️ Une mise à jour est en cours et les données affichées sur notre site
        peuvent ne pas être à jour.
        <br />
        Cette situation est susceptible de perdurer jusqu’à mardi 02 avril.
        Veuillez nous excuser pour la gêne occasionnée.
      </div>
    </div>
  </PrintNever>
);
