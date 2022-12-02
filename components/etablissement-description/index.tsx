import React from 'react';
import { IEtablissement, IUniteLegale } from '../../models';
import { formatDateLong } from '../../utils/helpers/formatting';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: Boolean;
}

const statusLabel = (estActif: Boolean | null) => {
  if (estActif === null) {
    return ' dans un état administratif inconnu';
  }
  return estActif ? ' en activité' : ' fermé';
};

export const EtablissementDescription: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
}) => (
  <>
    {uniteLegale.estDiffusible && (
      <p>
        Cet établissement est
        <b>{statusLabel(etablissement.estActif)}.</b> C’est
        {etablissement.estSiege ? (
          <b> le siège social</b>
        ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 ? (
          <> un ancien siège social</>
        ) : (
          <> un établissement secondaire</>
        )}{' '}
        de la structure{' '}
        <a href={`/entreprise/${uniteLegale.siren}`}>
          {uniteLegale.nomComplet}
        </a>
        ,
        {uniteLegale.etablissements.all.length > 1 ? (
          <>
            {' '}
            qui possède au total{' '}
            <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
              {uniteLegale.etablissements.nombreEtablissements} établissements.
            </a>
          </>
        ) : (
          <>
            {' '}
            et{' '}
            <a href={`/entreprise/${uniteLegale.siren}#etablissements`}>
              son unique établissement
            </a>
          </>
        )}
        .
      </p>
    )}
    <p>
      {etablissement.dateCreation && (
        <>
          Cet établissement a été crée le{' '}
          <b>{formatDateLong(etablissement.dateCreation)}</b>
        </>
      )}{' '}
      {etablissement.dateDebutActivite && !etablissement.estActif && (
        <>
          et il a été fermé le{' '}
          <b>{formatDateLong(etablissement.dateDebutActivite)}</b>
        </>
      )}{' '}
      {etablissement.adresse && (
        <>
          et il est domicilié au <a href="#contact">{etablissement.adresse}</a>
        </>
      )}
      .
    </p>
  </>
);
