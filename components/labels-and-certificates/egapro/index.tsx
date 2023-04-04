import React from 'react';
import FAQLink from '#components-ui/faq-link';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEgapro } from '#models/egapro';

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

export const EgaproSection: React.FC<{
  egapro: IEgapro | IAPINotRespondingError;
}> = ({ egapro }) => {
  const sectionTitle = `Égalité professionnelle - Index Egapro`;

  if (isAPINotResponding(egapro)) {
    const isNotFound = egapro.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.METI]}>
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

  const body = [
    ['Index', ...egapro.scores.notes],
    ['Écart rémunérations', ...egapro.scores.remunerations],
    ["Écart taux d'augmentation", ...egapro.scores.augmentations],
    ['Écart taux promotion', ...egapro.scores.promotions],
    ['Hautes rémunérations', ...egapro.scores.hautesRemunerations],
    ['Retour congé maternité', ...egapro.scores.congesMaternite],
  ];

  const plural = egapro.years.length > 0;

  return (
    <Section title={sectionTitle} sources={[EAdministration.METI]}>
      Cette entreprise de <b>{egapro.employeesSizeRange}</b> a déclaré{' '}
      {plural ? 'plusieurs' : 'une'} <FAQEgapro />
      <p>
        Les données déclarées pour une année sont récoltées l’année précédente.
        Par exemple, les données 2018 ont été récoltées en 2017.
      </p>
      <FullTable head={['Année', ...egapro.indexYears]} body={body} />
    </Section>
  );
};
