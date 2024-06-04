'use client';

import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { AsyncDataSectionClient } from '#components/section/data-section/client';
import { EAdministration } from '#models/administrations/EAdministration';
import { IUniteLegale } from '#models/core/types';
import useFetchCarteProfessionnelleTP from 'hooks/fetch/carte-professionnelle-TP';

export default function CarteProfessionnelleTPSection({
  uniteLegale,
}: {
  uniteLegale: IUniteLegale;
}) {
  const carteProfessionnelleTravauxPublics =
    useFetchCarteProfessionnelleTP(uniteLegale);

  return (
    <AsyncDataSectionClient
      title="Carte professionnelle travaux publics"
      id="carte-professionnelle-travaux-publics"
      isProtected
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
      sources={[EAdministration.FNTP]}
      data={carteProfessionnelleTravauxPublics}
    >
      {(data) => (
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
              to={`${data.documentUrl}`}
            >
              <Icon slug="download">Télécharger le justificatif</Icon>
            </ButtonLink>
          </div>
        </>
      )}
    </AsyncDataSectionClient>
  );
}
