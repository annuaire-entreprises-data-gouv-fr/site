import routes from '#clients/routes';
import FAQLink from '#components-ui/faq-link';
import {
  estDiffusible,
  estNonDiffusibleProtected,
  nonDiffusibleDataFormatter,
} from '#models/core/diffusion';
import { IEtablissement } from '#models/core/types';
import { AppScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import React from 'react';

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  session: ISession | null;
  label?: string;
}> = ({ etablissement, label, session }) => {
  const link = (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${routes.sireneInsee.avis}${etablissement.siret}`}
    >
      {label || 'Avis de situation'}
    </a>
  );

  if (estDiffusible(etablissement)) {
    return link;
  } else {
    if (hasRights(session, AppScope.isAgent)) {
      if (estNonDiffusibleProtected(etablissement)) {
        return link;
      } else {
        return (
          <FAQLink tooltipLabel="Document non disponible">
            L’avis de situation INSEE n’est pas disponible pour les entreprises
            non diffusibles, y compris les agents publics.
          </FAQLink>
        );
      }
    } else {
      return (
        <a href="/faq/justificatif-immatriculation-non-diffusible">
          {nonDiffusibleDataFormatter('document non-diffusible')}
        </a>
      );
    }
  }
};

export default AvisSituationLink;
