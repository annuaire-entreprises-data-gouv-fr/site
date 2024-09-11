import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { estNonDiffusibleStrict } from '#models/core/diffusion';
import { IETATADMINSTRATIF, estActif } from '#models/core/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import {
  formatAge,
  formatDateLong,
  formatSiret,
  uniteLegaleLabel,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';

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
      {!estNonDiffusibleStrict(uniteLegale) && (
        <>
          <span>
            Cet{' '}
            <FAQLink tooltipLabel="établissement">
              Une {uniteLegaleLabel(uniteLegale)} est constituée d’autant
              d’établissements qu’il y a de lieux différents où elle exerce - ou
              a exercé - son activité.
              <br />
              <br />
              Il faut bien distinguer la{' '}
              <a href={`/entreprise/${uniteLegale.chemin}`}>
                fiche résumé{' '}
                {uniteLegaleLabelWithPronounContracted(uniteLegale)}
              </a>{' '}
              et les{' '}
              <a href={`/entreprise/${uniteLegale.chemin}#etablissements`}>
                fiches de ses établissements
              </a>
              .
            </FAQLink>
            , immatriculé sous le siret {formatSiret(etablissement.siret)}, est
            <strong>{statusLabel(etablissement.etatAdministratif)}.</strong>
            {etablissement.dateCreation && (
              <>
                {' '}
                Il a été créé le{' '}
                <strong>{formatDateLong(etablissement.dateCreation)}</strong>
                {ageCreation && <>, il y a {ageCreation}</>}.{' '}
              </>
            )}
            {etablissement.dateDebutActivite && !estActif(etablissement) && (
              <>
                Il a été fermée le{' '}
                <strong>
                  {formatDateLong(etablissement.dateDebutActivite)}
                </strong>
                {ageFermeture && <>, il y a {ageFermeture}</>}.{' '}
              </>
            )}
            C’est
            {etablissement.estSiege ? (
              <strong> le siège social</strong>
            ) : etablissement.ancienSiege ? (
              <> un ancien siège social</>
            ) : (
              <> un établissement secondaire</>
            )}{' '}
            {uniteLegaleLabelWithPronounContracted(uniteLegale)}{' '}
            <a href={`/entreprise/${uniteLegale.chemin}`}>
              {uniteLegale.nomComplet}
            </a>
            {'. '}
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
                  {etablissement.adresse}
                </a>
              </>
            )}
            .
          </span>
        </>
      )}
    </>
  );
};
