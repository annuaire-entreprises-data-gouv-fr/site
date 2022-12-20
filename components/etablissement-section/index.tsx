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
import { formatDate, formatSiret } from '#utils/helpers';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
  usedInEntreprisePage?: boolean;
  withDenomination?: boolean;
}

const EtablissementSection: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  usedInEntreprisePage,
  withDenomination,
}) => {
  const data = [
    ...(withDenomination
      ? [
          ['Dénomination de l’unité légale', uniteLegale.nomComplet],
          [
            'Type d’établissement',
            <>
              {etablissement.estSiege ? (
                <Tag className="info">siège social</Tag>
              ) : uniteLegale.allSiegesSiret.indexOf(etablissement.siret) >
                -1 ? (
                <Tag>ancien siège social</Tag>
              ) : (
                <Tag>secondaire</Tag>
              )}
              {' ( '}
              <a key="entite" href={`/entreprise/${uniteLegale.siren}`}>
                → voir la page de l’unité légale
              </a>
              {' )'}
            </>,
          ],
        ]
      : []),
    ...(etablissement.denomination
      ? [['Nom de l’établissement', etablissement.denomination]]
      : []),
    ...(etablissement.enseigne
      ? [['Enseigne de l’établissement', etablissement.enseigne]]
      : []),
    [
      <FAQLink tooltipLabel="Adresse">
        <a href="/faq/modifier-adresse">Comment modifier une adresse ?</a>
      </FAQLink>,
      etablissement.adresse ? (
        <>
          <CopyPaste>{etablissement.adresse}</CopyPaste>
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
      ? [['N° TVA Intracommunautaire', <TVACell />]]
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
      <AvisSituationLink siret={etablissement.siret} />,
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
        />
      )}
      <Section
        title={
          usedInEntreprisePage
            ? `Siège social`
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

        @media only screen and (min-width: 1px) and (max-width: 600px) {
          .section-wrapper {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};
export default EtablissementSection;
