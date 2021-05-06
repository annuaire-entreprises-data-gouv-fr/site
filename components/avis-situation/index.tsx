import React from 'react';

const AvisSituation: React.FC<{ siret: string }> = ({ siret }) => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href={`https://api.avis-situation-sirene.insee.fr/identification/pdf/${siret}`}
  >
    Avis de situation
  </a>
);

export default AvisSituation;
