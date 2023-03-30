import React from 'react';
import { HorizontalSeparator } from '#components-ui/horizontal-separator';
import AdministrationNotResponding from '#components/administration-not-responding';
import { Section } from '#components/section';
import { FullTable } from '#components/table/full';
import { EAdministration } from '#models/administrations';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IEgapro } from '#models/egapro';

export const EgaproSection: React.FC<{
  egapro: IEgapro | IAPINotRespondingError;
}> = ({ egapro }) => {
  const sectionTitle = `Égalité professionnelle - Egapro`;

  if (isAPINotResponding(egapro)) {
    const isNotFound = egapro.errorType === 404;

    if (isNotFound) {
      return (
        <Section title={sectionTitle} sources={[EAdministration.METI]}>
          <p>
            Nous n’avons pas retrouvé les déclarations d’égalité professionnelle
            - Egapro de cette structure.
          </p>
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
    ['Index Egapro', ...egapro.scores.notes],
    ['Écart rémunérations', ...egapro.scores.remunerations],
    ["Écart taux d'augmentation", ...egapro.scores.augmentations],
    ['Écart taux promotion', ...egapro.scores.promotions],
    ['Hautes rémunérations', ...egapro.scores.hautesRemunerations],
    ['Retour congé maternité', ...egapro.scores.congesMaternite],
  ];

  const plural = egapro.years.length > 0;

  return (
    <div id="entreprise">
      <Section title={sectionTitle} sources={[EAdministration.METI]}>
        <p>
          Cette entreprise de <b>{egapro.employeesSizeRange}</b> a effectué{' '}
          {plural ? 'plusieurs' : 'une'} déclaration{plural} d’égalité entre les
          hommes et les femmes.
        </p>
        <FullTable head={['Indicateurs', ...egapro.years]} body={body} />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};
