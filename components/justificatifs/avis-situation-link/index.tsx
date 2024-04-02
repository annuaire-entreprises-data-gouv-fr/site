import React from 'react';
import routes from '#clients/routes';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/core/statut-diffusion';
import { IEtablissement } from '#models/core/types';
import { ISession, isAgent } from '#utils/session';

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  session: ISession | null;
  label?: string;
}> = ({ etablissement, label, session }) =>
  estDiffusible(etablissement) || isAgent(session) ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${routes.sireneInsee.avis}${etablissement.siret}`}
    >
      {label || 'Avis de situation'}
    </a>
  ) : (
    <>{nonDiffusibleDataFormatter('document non-diffusible')}</>
  );

export default AvisSituationLink;
