import React from 'react';
import routes from '../../clients/routes';
import {
  extractNicFromSiret,
  extractSirenFromSiret,
} from '../../utils/helpers/siren-and-siret';

const AvisSituation: React.FC<{ siret: string }> = ({ siret }) => (
  <form
    id="avis-situation"
    name="avis-situation"
    action={routes.sireneInsee.avis}
    method="post"
  >
    <input
      type="hidden"
      name="form.siren"
      value={extractSirenFromSiret(siret)}
    />
    <input type="hidden" name="form.nic" value={extractNicFromSiret(siret)} />
    <input
      type="submit"
      id="boutonAide"
      className="bouton"
      value="Télécharger l’avis de situation"
    />
    <style jsx>{`
      #avis-situation input {
        border: none;
        padding: 0;
        margin: 0;
        background: transparent;
        width: auto;
        cursor: pointer;
        box-shadow: 0 1px 0 0 currentColor;
        color: inherit;
        border-radius: 0;
        padding: 2px 0;
      }

      #avis-situation input:active {
        outline: 2px solid #2a7ffe;
        outline-offset: 2px;
      }
    `}</style>
  </form>
);

export default AvisSituation;
