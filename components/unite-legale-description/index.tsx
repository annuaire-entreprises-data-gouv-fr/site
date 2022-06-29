import React from 'react';
import { IUniteLegale } from '../../models';
import { formatDateLong } from '../../utils/helpers/formatting';

export const UnitLegaleDescription: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => (
  <p>
    <>L’unité légale {uniteLegale.nomComplet}</>{' '}
    {uniteLegale.natureJuridique && (
      <>
        est une <b>{uniteLegale.libelleNatureJuridique}</b>{' '}
      </>
    )}
    {uniteLegale.dateCreation && (
      <>
        créée le <b>{formatDateLong(uniteLegale.dateCreation)}</b>
      </>
    )}
    {uniteLegale.dateDebutActivite && !uniteLegale.estActive && (
      <>
        {' '}
        et fermée le <b>{formatDateLong(uniteLegale.dateDebutActivite)}</b>
      </>
    )}
    {uniteLegale.siege && uniteLegale.siege.adresse && (
      <>
        , dont le siège est domicilié au{' '}
        <a href={`/carte/${uniteLegale.siege.siret}`}>
          {uniteLegale.siege.adresse}
        </a>
      </>
    )}
    .{' '}
    {uniteLegale.etablissements && (
      <>
        Cette entité possède{' '}
        <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
          {uniteLegale.nombreEtablissements} établissement(s).
        </a>
      </>
    )}
  </p>
);
