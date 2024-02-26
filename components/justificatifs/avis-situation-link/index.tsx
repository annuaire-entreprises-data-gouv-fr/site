import React from 'react';
import routes from '#clients/routes';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/core/statut-diffusion';
import { IEtablissement } from '#models/core/types';

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  label?: string;
}> = ({ etablissement, label }) =>
  estDiffusible(etablissement) ? (
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
