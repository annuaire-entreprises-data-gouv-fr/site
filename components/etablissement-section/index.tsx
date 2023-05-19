import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import AvisSituationLink from '#components/avis-situation-link';
import { EtablissementDescription } from '#components/etablissement-description';
import { Section } from '#components/section';
import { CopyPaste, TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import { EAdministration } from '#models/administrations';
import { estActif } from '#models/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  getAdresseEtablissement,
  getDenominationEtablissement,
  getEnseigneEtablissement,
  getNomComplet,
} from '#models/statut-diffusion';
import { formatDate, formatSiret } from '#utils/helpers';
import { ISession } from '#utils/session';

type IProps = {
  session: ISession | null;
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: boolean;
  withDenomination?: boolean;
};

const EtablissementSection: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  usedInEntreprisePage,
  withDenomination,
  session,
}) => {
  const data = [
    ...(withDenomination
      ? [
          [
            'Dénomination de l’unité légale',
            getNomComplet(uniteLegale, session),
          ],
          [
            'Type d’établissement',
            <>
              {etablissement.estSiege ? (
                <Tag color="info">siège social</Tag>
              ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) >
                -1 ? (
                <Tag>ancien siège social</Tag>
              ) : (
                <Tag>secondaire</Tag>
              )}
              {' ( '}
              <a key="entite" href={`/entreprise/${uniteLegale.chemin}`}>
                → voir la page de l’unité légale
              </a>
              {' )'}
            </>,
          ],
        ]
      : []),
    ...(etablissement.enseigne
      ? [
          [
            'Enseigne de l’établissement',
            getEnseigneEtablissement(etablissement, session),
          ],
        ]
      : []),
    ...(etablissement.denomination
      ? [
          [
            'Nom de l’établissement',
            getDenominationEtablissement(etablissement, session),
          ],
        ]
      : []),
    [
      <FAQLink to="/faq/modifier-adresse" tooltipLabel="Adresse">
        Comment modifier une adresse ?
      </FAQLink>,
      etablissement.adresse ? (
        <>
          <CopyPaste>
            {getAdresseEtablissement(etablissement, session)}
          </CopyPaste>
          <PrintNever key="adresse-link">
            <a href={`/carte/${etablissement.siret}`}>→ voir sur la carte</a>
            <br />
            <br />
          </PrintNever>
        </>
      ) : (
        ''
      ),
    ],
    ['SIRET', formatSiret(etablissement.siret)],
    ['Clef NIC', etablissement.nic],
    ...(!usedInEntreprisePage
      ? [
          [
            <FAQLink tooltipLabel="N° TVA Intracommunautaire">
              <a href="/faq/tva-intracommunautaire">
                Comprendre le numéro de TVA intracommunautaire
              </a>
            </FAQLink>,
            <TVACell siren={uniteLegale.siren} />,
          ],
        ]
      : []),
    [
      'Activité principale de l’unité légale (NAF/APE)',
      uniteLegale.libelleActivitePrincipale,
    ],
    [
      'Activité principale de l’établissement (NAF/APE)',
      etablissement.libelleActivitePrincipale,
    ],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    ['Tranche d’effectif salarié', etablissement.libelleTrancheEffectif],
    ['Date de création', formatDate(etablissement.dateCreation)],
    [
      'Date de dernière mise à jour',
      formatDate(etablissement.dateDerniereMiseAJour),
    ],
    [
      'Avis de situation Insee',
      <AvisSituationLink etablissement={etablissement} />,
    ],
    ...(!estActif(etablissement)
      ? [['Date de fermeture', formatDate(etablissement.dateFermeture || '')]]
      : []),
  ];

  return (
    <>
      {!usedInEntreprisePage && (
        <EtablissementDescription
          etablissement={etablissement}
          uniteLegale={uniteLegale}
          session={session}
        />
      )}
      <Section
        title={
          usedInEntreprisePage
            ? `Siège social de ${getNomComplet(uniteLegale, session)}`
            : `Établissement${etablissement.estSiege ? ' (siège social)' : ''}`
        }
        id="etablissement"
        sources={[EAdministration.INSEE]}
      >
        <TwoColumnTable body={data} />
      </Section>
      <HorizontalSeparator />
      <BreakPageForPrint />
      <style jsx>{`
        .section-wrapper {
          display: flex;
          flex-direction: row;
        }

        @media only screen and (min-width: 1px) and (max-width: 576px) {
          .section-wrapper {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};
export default EtablissementSection;
