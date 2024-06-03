'use client';

import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { DataSectionClient } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import { useFetchCarteProfessionnelle } from 'hooks/fetch/espace-agent/carte-professionnelle-travaux-publics-section';

type IProps = {
  uniteLegale: IUniteLegale;
};
export function CarteProfessionnelleTravauxPublicsSection({
  uniteLegale,
}: IProps) {
  const carteProfessionnelleTravauxPublics =
    useFetchCarteProfessionnelle(uniteLegale);

  return (
    <DataSectionClient
      title="Carte professionnelle travaux publics"
      id="carte-professionnelle-travaux-publics"
      notFoundInfo={
        <>
          Cette entreprise n’a pas de{' '}
          <a
            href="https://www.fntp.fr/tout-savoir-sur-la-carte-professionnelle-tp"
            aria-label="En savoir plus sur la carte professionnelle d’entrepreneur de travaux publics, nouvelle fenêtre"
            target="_blank"
            rel="noreferrer"
          >
            carte professionnelle d’entrepreneur de travaux publics
          </a>
          .
        </>
      }
      isProtected
      sources={[EAdministration.FNTP]}
      data={carteProfessionnelleTravauxPublics}
    >
      {(carteProfessionnelleTravauxPublics) => (
        <>
          <p>
            Cette entreprise possède une{' '}
            <a
              href="https://www.fntp.fr/tout-savoir-sur-la-carte-professionnelle-tp"
              aria-label="En savoir plus sur la carte professionnelle d’entrepreneur de travaux publics, nouvelle fenêtre"
              target="_blank"
              rel="noreferrer"
            >
              carte professionnelle d’entrepreneur de travaux publics
            </a>
            , délivrée par la FNTP.
          </p>

          <div className="layout-center">
            <ButtonLink
              target="_blank"
              ariaLabel="Télécharger le justificatif de la carte professionnelle travaux publics, téléchargement dans une nouvelle fenêtre"
              to={`${carteProfessionnelleTravauxPublics.documentUrl}`}
            >
              <Icon slug="download">Télécharger le justificatif</Icon>
            </ButtonLink>
          </div>
        </>
      )}
    </DataSectionClient>
  );
}
