import React from 'react';
import { IEtablissement } from '#models/index';
import {
  estDiffusible,
  nonDiffusibleDataFormatter,
} from '#models/statut-diffusion';

const AvisSituationLink: React.FC<{
  etablissement: IEtablissement;
  label?: string;
}> = ({ etablissement, label }) =>
  estDiffusible(etablissement) ? (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`https://api.avis-situation-sirene.insee.fr/identification/pdf/${etablissement.siret}`}
    >
      {label || 'Avis de situation'}
    </a>
  ) : (
    <>{nonDiffusibleDataFormatter('document non-diffusible')}</>
  );

export default AvisSituationLink;
