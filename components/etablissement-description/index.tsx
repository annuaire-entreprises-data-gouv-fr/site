import React from 'react';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  estNonDiffusible,
  getAdresseEtablissement,
  getNomComplet,
} from '#models/statut-diffusion';
import { formatDateLong } from '#utils/helpers';
import { ISession } from '#utils/session';

type IProps = {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  session: ISession | null;
};

const statusLabel = (etatAdministratif: IETATADMINSTRATIF) => {
  if (etatAdministratif === IETATADMINSTRATIF.ACTIF) {
    return ' en activité';
  }
  if (
    etatAdministratif === IETATADMINSTRATIF.CESSEE ||
    etatAdministratif === IETATADMINSTRATIF.FERME
  ) {
    return ' fermé';
  }
  return ' dans un état administratif inconnu';
};

export const EtablissementDescription: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  session,
}) => (
  <>
    {!estNonDiffusible(uniteLegale) && (
      <p>
        Cet établissement est
        <b>{statusLabel(etablissement.etatAdministratif)}.</b> C’est
        {etablissement.estSiege ? (
          <b> le siège social</b>
        ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 ? (
          <> un ancien siège social</>
        ) : (
          <> un établissement secondaire</>
        )}{' '}
        de la structure{' '}
        <a href={`/entreprise/${uniteLegale.chemin}`}>
          {getNomComplet(uniteLegale, session)}
        </a>
        ,
        {uniteLegale.etablissements.all.length > 1 ? (
          <>
            {' '}
            qui possède au total{' '}
            <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
              {uniteLegale.etablissements.nombreEtablissements} établissements.
            </a>
          </>
        ) : (
          <>
            {' '}
            et{' '}
            <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
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
      {etablissement.dateDebutActivite && !estActif(etablissement) && (
        <>
          et il a été fermé le{' '}
          <b>{formatDateLong(etablissement.dateDebutActivite)}</b>
        </>
      )}{' '}
      {etablissement.adresse && (
        <>
          et il est domicilié au{' '}
          <a href={`/carte/${etablissement.siret}`}>
            {getAdresseEtablissement(etablissement, session)}
          </a>
        </>
      )}
      .
    </p>
  </>
);
