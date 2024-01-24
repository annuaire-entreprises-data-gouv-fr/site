import React from 'react';
import { PrintNever } from '#components-ui/print-visibility';
import { INSEE } from '#components/administrations';
import NonRenseigne from '#components/non-renseigne';
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
        <INSEE />
        ), les fonctionnalités suivantes sont dégradées :
        <ul>
          <li>
            Sur la page d’un établissement ou d’un siège social, le nombre de
            salariés, la date de fermeture et la date de dernière mise à jour
            sont <NonRenseigne />
          </li>
          <li>
            Si une entreprise a plus de 100 établissements, la liste de ses
            établissements ne fonctionne plus.
          </li>
        </ul>
        Veuillez nous excuser pour la gêne occasionnée, nous faisons de notre
        mieux pour rétablir le service.
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
