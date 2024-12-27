'use client';

import ButtonLink from '#components-ui/button';
import FAQLink from '#components-ui/faq-link';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import IsActiveTag from '#components-ui/tag/is-active-tag';
import { NonDiffusibleTag } from '#components-ui/tag/non-diffusible-tag';
import { ConventionCollectivesBadgesSection } from '#components/badges-section/convention-collectives';
import AvisSituationLink from '#components/justificatifs/avis-situation-link';
import { CopyPaste } from '#components/table/copy-paste';
import { FullTable } from '#components/table/full';
import { TwoColumnTable } from '#components/table/simple';
import { estDiffusible, estNonDiffusibleStrict } from '#models/core/diffusion';
import { estActif } from '#models/core/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/core/types';
import { ISession } from '#models/user/session';
import {
  formatDate,
  formatSiret,
  uniteLegaleLabelWithPronounContracted,
} from '#utils/helpers';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const EtablissementsTable: React.FC<{
  filteredEtablissements: IEtablissement[];
  uniteLegale: IUniteLegale;
  session: ISession | null;
  setSelectedEtablissement: (e: IEtablissement | null) => void;
  showMap: () => void;
  selectedEtablissement: IEtablissement | null;
}> = ({
  filteredEtablissements,
  uniteLegale,
  session,
  selectedEtablissement,
  showMap,
  setSelectedEtablissement,
}) => {
  const [orderedEtablissmentList, setOrderedList] = useState<IEtablissement[]>(
    []
  );

  useEffect(() => {
    const list = filteredEtablissements;
    list.sort((e) => (estActif(e) ? -1 : 1)).sort((e) => (e.estSiege ? -1 : 1));

    setOrderedList(list);
  });

  const showOnMap = (e: IEtablissement) => {
    setSelectedEtablissement(e);
    showMap();
  };

  return (
    <FullTable
      head={['Établissement (siret, adresse, activité)', 'Création', 'État']}
      body={orderedEtablissmentList.map((etablissement: IEtablissement) => [
        <>
          <div>
            <a href="#">{formatSiret(etablissement.siret)}</a>
            {etablissement.estSiege ? (
              <Tag color="info">siège social</Tag>
            ) : etablissement.ancienSiege ? (
              <Tag>ancien siège social</Tag>
            ) : null}
            {!estDiffusible(etablissement) && (
              <NonDiffusibleTag etablissementOrUniteLegale={etablissement} />
            )}
          </div>
          {!estNonDiffusibleStrict(etablissement) ? (
            <>
              {etablissement.activitePrincipale !==
              uniteLegale.activitePrincipale ? (
                <div>
                  <FAQLink tooltipLabel={<strong>Activité différente</strong>}>
                    Cet établissement a une activité différente de l’activité
                    principale{' '}
                    {uniteLegaleLabelWithPronounContracted(uniteLegale)}{' '}
                    {uniteLegale.nomComplet}, qui est{' '}
                    <i>
                      {uniteLegale.libelleActivitePrincipale} (
                      {uniteLegale.activitePrincipale})
                    </i>
                  </FAQLink>
                  {' : '}
                  {etablissement.libelleActivitePrincipale}
                </div>
              ) : null}
              <Icon slug="mapPin">{etablissement.adressePostale}</Icon>
            </>
          ) : null}

          <div>
            <div className={styles.tableDetailsLabel}></div>
            <div className={styles.tableDetails}>
              <TwoColumnTable
                body={[
                  [
                    'Type',
                    <>
                      {etablissement.estSiege ? (
                        <Tag color="info">siège social</Tag>
                      ) : etablissement.ancienSiege ? (
                        <Tag>ancien siège social</Tag>
                      ) : (
                        <Tag>secondaire</Tag>
                      )}
                    </>,
                  ],
                  ...(etablissement.enseigne
                    ? [['Enseigne de l’établissement', etablissement.enseigne]]
                    : []),
                  ...(etablissement.denomination
                    ? [['Nom de l’établissement', etablissement.denomination]]
                    : []),
                  [
                    'Adresse',
                    etablissement.adresse ? (
                      <>
                        <CopyPaste label="Adresse">
                          {etablissement.adresse}
                        </CopyPaste>
                        <PrintNever key="adresse-link">
                          <ButtonLink
                            alt
                            small
                            onClick={() => showOnMap(etablissement)}
                          >
                            <Icon slug="mapPin">Voir sur la carte</Icon>
                          </ButtonLink>
                          <br />
                        </PrintNever>
                      </>
                    ) : (
                      ''
                    ),
                  ],
                  ['SIRET', formatSiret(etablissement.siret)],
                  ['Clef NIC', etablissement.nic],
                  [
                    `Activité principale`,
                    etablissement.libelleActivitePrincipale,
                  ],
                  [
                    'Tranche d’effectif salarié',
                    libelleTrancheEffectif(
                      uniteLegale.trancheEffectif === 'N'
                        ? 'N'
                        : etablissement.trancheEffectif,
                      etablissement.anneeTrancheEffectif
                    ),
                  ],
                  ['Date de création', formatDate(etablissement.dateCreation)],
                  ...(etablissement.dateMiseAJourInsee
                    ? [
                        [
                          'Dernière modification des données Insee',
                          formatDate(etablissement.dateMiseAJourInsee),
                        ],
                      ]
                    : []),
                  ...(!estActif(etablissement)
                    ? [
                        [
                          'Date de fermeture',
                          formatDate(etablissement.dateFermeture || ''),
                        ],
                      ]
                    : []),
                  ...(etablissement.complements.idcc &&
                  etablissement.complements.idcc.length > 0
                    ? [
                        [
                          'Convention collective',
                          [
                            <ConventionCollectivesBadgesSection
                              conventionCollectives={
                                etablissement.complements.idcc
                              }
                              siren={uniteLegale.siren}
                            />,
                          ],
                        ],
                      ]
                    : []),
                  [
                    'Justificatif(s) d’existence',
                    etablissement.siret ? (
                      <>
                        <AvisSituationLink
                          session={session}
                          etablissement={etablissement}
                          label="Télécharger l’avis de situation Insee"
                          button={true}
                        />
                      </>
                    ) : (
                      ''
                    ),
                  ],
                ]}
              />
            </div>
          </div>
        </>,
        (!estNonDiffusibleStrict(etablissement) &&
          formatDate(etablissement.dateCreation)) ||
          '',
        <>
          <IsActiveTag
            etatAdministratif={etablissement.etatAdministratif}
            statutDiffusion={etablissement.statutDiffusion}
            since={etablissement.dateFermeture}
          />
        </>,
      ])}
    />
  );
};
