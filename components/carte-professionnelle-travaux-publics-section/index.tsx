import ButtonLink from '#components-ui/button';
import { Icon } from '#components-ui/icon/wrapper';
import { PrintNever } from '#components-ui/print-visibility';
import { DataSectionServer } from '#components/section/data-section/server';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { ICarteProfessionnelleTravauxPublics } from '#models/espace-agent/carte-professionnelle-travaux-publics';

type IProps = {
  carteProfessionnelleTravauxPublics:
    | ICarteProfessionnelleTravauxPublics
    | IAPINotRespondingError;
};
export function CarteProfessionnelleTravauxPublicsSection({
  carteProfessionnelleTravauxPublics,
}: IProps) {
  return (
    <PrintNever>
      <DataSectionServer
        title="Carte professionnelle travaux publics"
        id="carte-professionnelle-travaux-publics"
        isProtected
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
      </DataSectionServer>
    </PrintNever>
  );
}
