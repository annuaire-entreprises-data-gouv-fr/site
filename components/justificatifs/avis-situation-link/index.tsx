import React from 'react';
import routes from '#clients/routes';
import FAQLink from '#components-ui/faq-link';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/core/statut-diffusion';
import { IEtablissement } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  session: ISession | null;
  label?: string;
}> = ({ etablissement, label, session }) =>
  estDiffusible(etablissement) ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${routes.sireneInsee.avis}${etablissement.siret}`}
    >
      {label || 'Avis de situation'}
    </a>
  ) : hasRights(session, EScope.isAgent) ? (
    <FAQLink tooltipLabel="Document non disponible">
      L’avis de situation INSEE n’est pas disponible pour les entreprises non
      diffusibles, y compris les agents publics.
    </FAQLink>
  ) : (
    <a href="/faq/justificatif-immatriculation-non-diffusible">
      {nonDiffusibleDataFormatter('document non-diffusible')}
    </a>
  );

export default AvisSituationLink;
