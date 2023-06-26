import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { estActif, IETATADMINSTRATIF } from '#models/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  estNonDiffusible,
  getAdresseEtablissement,
  getNomComplet,
} from '#models/statut-diffusion';
import {
  formatAge,
  formatDateLong,
  formatSiret,
  getCompanyLabel,
  getCompanyPronoun,
} from '#utils/helpers';
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
}) => {
  const ageCreation = etablissement.dateCreation
    ? formatAge(etablissement.dateCreation)
    : null;

  const ageFermeture =
    etablissement.dateDebutActivite && !estActif(etablissement)
      ? formatAge(etablissement.dateDebutActivite)
      : null;

  return (
    <>
      {!estNonDiffusible(uniteLegale) && (
        <>
          <span>
            Cet{' '}
            <FAQLink tooltipLabel="établissement">
              Une {getCompanyLabel(uniteLegale)} est constituée d’autant
              d’établissements qu’il y a de lieux différents où elle exerce - ou
              a exercé - son activité.
              <br />
              <br />
              Il faut bien distinguer la{' '}
              <a href={`/entreprise/${uniteLegale.chemin}`}>
                fiche résumé de {getCompanyPronoun(uniteLegale).toLowerCase()}
                {getCompanyLabel(uniteLegale)}
              </a>{' '}
              et les{' '}
              <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
                fiches de ses établissements
              </a>
              .
            </FAQLink>
            , immatriculé sous le siret {formatSiret(etablissement.siret)}, est
            <b>{statusLabel(etablissement.etatAdministratif)}.</b>
            {etablissement.dateCreation && (
              <>
                {' '}
                Il a été créée le{' '}
                <b>{formatDateLong(etablissement.dateCreation)}</b>
                {ageCreation && <>, il y a {ageCreation}</>}.{' '}
              </>
            )}
            {etablissement.dateDebutActivite && !estActif(etablissement) && (
              <>
                Il a été fermée le{' '}
                <b>{formatDateLong(etablissement.dateDebutActivite)}</b>
                {ageFermeture && <>, il y a {ageFermeture}</>}.{' '}
              </>
            )}
            C’est
            {etablissement.estSiege ? (
              <b> le siège social</b>
            ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) > -1 ? (
              <> un ancien siège social</>
            ) : (
              <> un établissement secondaire</>
            )}{' '}
            de {getCompanyPronoun(uniteLegale).toLowerCase()}
            {getCompanyLabel(uniteLegale)}{' '}
            <a href={`/entreprise/${uniteLegale.chemin}`}>
              {getNomComplet(uniteLegale, session)}
            </a>
            {uniteLegale.etablissements.all.length > 1 ? (
              <>
                , qui possède{' '}
                <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
                  {uniteLegale.etablissements.nombreEtablissements - 1} autre(s)
                  établissement(s)
                </a>
              </>
            ) : (
              <>
                {' et '}
                <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
                  son unique établissement
                </a>
              </>
            )}
            .
          </span>
          <p>
            {etablissement.libelleActivitePrincipale && (
              <>
                Son domaine d’activité est :{' '}
                {(etablissement.libelleActivitePrincipale || '').toLowerCase()}.
              </>
            )}
            {etablissement.adresse && (
              <>
                {' '}
                Il est domicilié au{' '}
                <a href={`/carte/${etablissement.siret}`}>
                  {getAdresseEtablissement(etablissement, session)}
                </a>
              </>
            )}
            .
          </p>
        </>
      )}
    </>
  );
};
