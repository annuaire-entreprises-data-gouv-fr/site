import routes from '#clients/routes';
import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import {
  ApplicationRights,
  hasRights,
} from '#models/authentication/user/rights';
import { ISession } from '#models/authentication/user/session';
import {
  documentNonDiffusiblePlaceHolder,
  estDiffusible,
  estNonDiffusibleProtected,
} from '#models/core/diffusion';
import { IEtablissement } from '#models/core/types';
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
    if (hasRights(session, ApplicationRights.isAgent)) {
      if (estNonDiffusibleProtected(etablissement)) {
        return link;
      } else {
        return (
          <FAQLink tooltipLabel="Document non disponible">
            L’avis de situation INSEE n’est pas disponible pour les entreprises
            non diffusibles, y compris pour les agents publics.
          </FAQLink>
        );
      }
    } else {
      return (
        <a href="/faq/justificatif-immatriculation-non-diffusible">
          {documentNonDiffusiblePlaceHolder(etablissement)}
        </a>
      );
    }
  }
};

export default AvisSituationLink;
