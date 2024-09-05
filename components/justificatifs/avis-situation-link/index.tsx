import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import {
  estDiffusible,
  estNonDiffusibleProtected,
  nonDiffusibleDataFormatter,
} from '#models/core/diffusion';
import { IEtablissement } from '#models/core/types';
import { EScope, hasRights } from '#models/user/rights';
import { ISession } from '#models/user/session';
import React from 'react';

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  session: ISession | null;
  label?: string;
  button?: boolean;
}> = ({ etablissement, label, button = false, session }) => {
  const link = button ? (
    <ButtonLink
      small
      alt
      to={`${routes.sireneInsee.avis}${etablissement.siret}`}
    >
      <Icon slug="download">{label || 'Avis de situation'}</Icon>
    </ButtonLink>
  ) : (
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
    if (hasRights(session, EScope.isAgent)) {
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
