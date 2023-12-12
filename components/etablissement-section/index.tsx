import React from 'react';
import FAQLink from '#components-ui/faq-link';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import BreakPageForPrint from '#components-ui/print-break-page';
import { PrintNever } from '#components-ui/print-visibility';
import { Tag } from '#components-ui/tag';
import AvisSituationLink from '#components/avis-situation-link';
import { Section } from '#components/section';
import { CopyPaste, TwoColumnTable } from '#components/table/simple';
import TVACell from '#components/tva-cell';
import { EAdministration } from '#models/administrations/EAdministration';
import { estActif } from '#models/etat-administratif';
import { IEtablissement, IUniteLegale } from '#models/index';
import {
  getAdresseEtablissement,
  getDenominationEtablissement,
  getEnseigneEtablissement,
  getEtablissementName,
  getNomComplet,
} from '#models/statut-diffusion';
import {
  formatDate,
  formatSiret,
  getCompanyLabel,
  getCompanyPronoun,
} from '#utils/helpers';
import { libelleTrancheEffectif } from '#utils/helpers/formatting/codes-effectifs';
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
  const companyType = `${getCompanyPronoun(
    uniteLegale
  ).toLowerCase()}${getCompanyLabel(uniteLegale)}`;

  const data = [
    ...(withDenomination
      ? [
          [
            `Dénomination de ${companyType}`,
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
                → voir la page de {companyType}
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
            <TVACell tva={uniteLegale.tva} />,
          ],
        ]
      : []),
    [
      `Activité principale de ${companyType} (NAF/APE)`,
      uniteLegale.libelleActivitePrincipale,
    ],
    [
      `Activité principale de l’établissement (NAF/APE)`,
      etablissement.libelleActivitePrincipale,
    ],
    ['Code NAF/APE de l’établissement', etablissement.activitePrincipale],
    ['Nature juridique', uniteLegale.libelleNatureJuridique],
    [
      'Tranche d’effectif salarié',
      libelleTrancheEffectif(
        uniteLegale.trancheEffectif === 'N'
          ? 'N'
          : etablissement.trancheEffectif,
        etablissement.anneeTrancheEffectif
      ),
    ],
    [
      `Date de création de ${companyType}`,
      formatDate(uniteLegale.dateCreation),
    ],
    [
      'Date de création de l’établissement',
      formatDate(etablissement.dateCreation),
    ],
    ...(etablissement.dateDerniereMiseAJour
      ? [
          [
            'Dernière modification des données Insee',
            formatDate(etablissement.dateDerniereMiseAJour),
          ],
        ]
      : []),
    ...(!estActif(etablissement)
      ? [['Date de fermeture', formatDate(etablissement.dateFermeture || '')]]
      : []),
    ['', <br />],
    [
      'Avis de situation Insee',
      <AvisSituationLink etablissement={etablissement} />,
    ],
  ];

  return (
    <>
      <Section
        title={
          usedInEntreprisePage
            ? `Siège social de ${getNomComplet(uniteLegale, session)}`
            : `Information légales de l’établissement ${getEtablissementName(
                etablissement,
                uniteLegale,
                session
              )} à ${etablissement.commune}`
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
