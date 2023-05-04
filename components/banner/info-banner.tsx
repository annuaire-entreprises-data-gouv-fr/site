import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import { INPI, INSEE } from '#components/administrations';
import constants from '#models/constants';

export const InfoBanner: React.FC<{}> = () => (
  <PrintNever>
    <div
      className="info-banner"
      role="dialog"
      aria-label="Instabilité des services de nos partenaires"
    >
      <div className="fr-container">
        ⚠️ Suite à une instabilité des services de nos partenaires (
        <INSEE />,
        <INPI />
        ), le site connaît actuellement des ralentissements et certaines fonctionnalités peuvent ne pas fonctionner (par exemple la pagination des établissements secondaires).
        <br>
        Veuillez nous excuser pour la gêne occasionnée, nous faisons de notre mieux pour
        rétablir le service.
      </div>
    </div>
    <style jsx>{`
      .info-banner {
        padding-top: 15px;
        padding-bottom: 15px;
        font-size: 0.9rem;
        width: 100%;
        background-color: #e5f3ff;
        font-family: 'Marianne', sans-serif;
        border-bottom: 2px solid ${constants.colors.frBlue};
      }
    `}</style>
  </PrintNever>
);
