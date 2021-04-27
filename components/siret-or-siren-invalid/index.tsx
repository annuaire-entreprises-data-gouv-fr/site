import React from 'react';
import {
  cleanSearchTerm,
  removeInvisibleChar,
  trimWhitespace,
} from '../../utils/helpers/formatting';
import { lookLikeSirenOrSiret } from '../../utils/helpers/siren-and-siret';

export const SiretOrSirenInvalid = ({ searchTerm = '' }) => {
  const cleanTerm = cleanSearchTerm(searchTerm);
  const isSuspect = lookLikeSirenOrSiret(cleanTerm);
  if (!isSuspect) {
    return <></>;
  }

  const siretOrSirenLabel = cleanTerm.length === 9 ? 'siren' : 'siret';
  return (
    <>
      <br />
      <div>
        <b>⚠️ Attention :</b> ce nombre a le format d’un numéro{' '}
        {siretOrSirenLabel}, mais il est <b>invalide</b> et n'existe pas.
        <p>
          Nous vous invitons à la plus grande vigilance, car cela peut être un{' '}
          {siretOrSirenLabel} frauduleux :
        </p>
        <ul>
          <li>Vérifiez que vous n'avez pas fait d'erreur de saisie</li>
          <li>
            Si ce {siretOrSirenLabel} vous a été fourni par une entreprise,
            vérifiez-le auprès de cette entreprise
          </li>
        </ul>
      </div>
      <style jsx>{`
        .results-counter {
          margin-top: 20px;
          color: rgb(112, 117, 122);
        }
      `}</style>
    </>
  );
};
