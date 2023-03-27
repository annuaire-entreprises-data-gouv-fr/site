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
import { IUniteLegale } from '#models/index';
import { getNomComplet } from '#models/statut-diffusion';

export const EgaproSection: React.FC<{
  uniteLegale: IUniteLegale;
  egapro: IEgapro | IAPINotRespondingError;
}> = ({ uniteLegale, egapro }) => {
  const sectionTitle = `Index Egapro de ${getNomComplet(uniteLegale)}`;

  if (isAPINotResponding(egapro)) {
    const isNotFound = egapro.errorType === 404;

    if (isNotFound) {
      // @TODO revoir wording
      return (
        <Section title={sectionTitle} sources={[EAdministration.MT]}>
          <p>Nous n’avons pas retrouvé les indexs Egapro de cette entreprise</p>
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
    ['Index', ...egapro.scores.map((score) => score.notes)],
    [
      'Écart rémunérations',
      ...egapro.scores.map((score) => score.notes_remunerations),
    ],
    [
      "Écart taux d'augmentation",
      ...egapro.scores.map((score) => score.notes_augmentations),
    ],
    [
      'Hautes rémunérations',
      ...egapro.scores.map((score) => score.notes_hautes_rémunérations),
    ],
  ];

  return (
    <div id="entreprise">
      <Section title={sectionTitle} sources={[EAdministration.MT]}>
        <FullTable
          head={['Indicateurs', ...egapro.scores.map((score) => score.annee)]}
          body={body}
        />
      </Section>
      <HorizontalSeparator />
    </div>
  );
};
