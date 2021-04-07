import React from 'react';
import { IUniteLegale } from '../../models';
import { formatDateLong } from '../../utils/helpers/formatting';

export const UnitLegaleDescription: React.FC<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => (
  <>
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
    {uniteLegale.dateDebutActivite &&
      uniteLegale.siege &&
      !uniteLegale.siege.estActif && (
        <>
          {' '}
          et fermée le <b>{formatDateLong(uniteLegale.dateDebutActivite)}</b>
        </>
      )}
    {uniteLegale.siege && uniteLegale.siege.adresse && (
      <>
        , dont le siège est domicilié au{' '}
        <a href={`/rechercher/carte?siret=${uniteLegale.siege.siret}`}>
          {uniteLegale.siege.adresse}
        </a>
      </>
    )}
    .{' '}
    {uniteLegale.etablissements && (
      <>
        Cette entité possède{' '}
        <a href={`#etablissements`}>
          {uniteLegale.nombreEtablissements} établissement(s).
        </a>
      </>
    )}
    <br />
    <br />
  </>
);
