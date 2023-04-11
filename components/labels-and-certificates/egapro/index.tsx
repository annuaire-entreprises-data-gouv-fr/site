import React from 'react';
import FAQLink from '#components-ui/faq-link';
import InformationTooltip from '#components-ui/information-tooltip';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEgapro } from '#models/egapro';

const getColor = (note: number) => {
  try {
    if (note > 75) {
      return '#18753c';
    }
    if (note > 50) {
      return '#9f551b';
    }
    return '#cf0b06';
  } catch {
    return '#000';
  }
};

const FAQEgapro = () => (
  <FAQLink
    tooltipLabel={`index d’égalité professionnelle entre les femmes et les hommes.`}
  >
    L’Index Egapro permet de mesurer l’égalité professionnelle entre les femmes
    et les hommes dans les entreprises de plus de 50 salariés.
    <br />
    <a href="/faq/egapro-egalite-professionnelle-femme-homme">
      → En savoir plus
    </a>
  </FAQLink>
);

const NC = () => (
  <InformationTooltip label="Cette année là, cette structure n’était pas concernée par ce critère.">
    <i>NC</i>
  </InformationTooltip>
);

export const EgaproSection: React.FC<{
  egapro: IEgapro | IAPINotRespondingError;
}> = ({ egapro }) => {
  const sectionTitle = `Égalité professionnelle - Egapro`;

  if (isAPINotResponding(egapro)) {
    const isNotFound = egapro.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.MTPEI]}>
          Nous n’avons pas retrouvé d’
          <FAQEgapro /> pour cette entreprise.
        </Section>
      );
    }
    return (
      <AdministrationNotResponding
        administration={egapro.administration}
        errorType={egapro.errorType}
        title={sectionTitle}
      />
    );
  }

  const mapToNc = (e: any) => e ?? <NC />;
  const {
    notes = [],
    remunerations = [],
    augmentations = [],
    augmentationsPromotions = [],
    promotions = [],
    congesMaternite = [],
    hautesRemunerations = [],
  } = egapro?.scores || {};

  const body = [
    [
      'Index (sur 100)',
      ...notes
        .map((note) =>
          note ? <b style={{ color: getColor(note) }}>{note}</b> : null
        )
        .map(mapToNc),
    ],
    [
      <b>
        <FAQLink tooltipLabel="Détails">
          L’index est une synthèse des différents indicateurs ci-dessous
          <br />
          <a href="https://egapro.travail.gouv.fr/aide-simulation">
            → En savoir plus
          </a>
        </FAQLink>
      </b>,
      ...egapro.years.map(() => ''),
    ],
    ['    Écart rémunérations (sur 40)', ...remunerations.map(mapToNc)],
    // only less than 250
    ...[
      egapro.lessThan250
        ? [
            `    Écart taux d'augmentation (sur 35)`,
            ...augmentationsPromotions.map(mapToNc),
          ]
        : [],
    ],
    // only more than 250
    ...[
      !egapro.lessThan250
        ? [
            `    Écart taux d'augmentation (sur 20)`,
            ...augmentations.map(mapToNc),
          ]
        : [],
    ],
    // only more than 250
    ...[
      !egapro.lessThan250
        ? ['    Écart taux promotion (sur 15)', ...promotions.map(mapToNc)]
        : [],
    ],
    ['    Retour congé maternité (sur 15)', ...congesMaternite.map(mapToNc)],
    ['    Hautes rémunérations (sur 10)', ...hautesRemunerations.map(mapToNc)],
  ];

  const plural = egapro.years.length > 0;

  return (
    <Section title={sectionTitle} sources={[EAdministration.MTPEI]}>
      Cette structure de <b>{egapro.employeesSizeRange}</b> a déclaré{' '}
      {plural ? 'plusieurs' : 'une'} <FAQEgapro />
      <p>
        Chaque déclaration se fait l’année <b>N</b> au titre de l’année{' '}
        <b>N-1</b> (par exemple : les données déclarées en 2023 sont celles de
        2022).
      </p>
      <FullTable head={['Année', ...egapro.indexYears]} body={body} />
    </Section>
  );
};
