import routes from '#clients/routes';
import { Warning } from '#components-ui/alerts';
import { DataSection } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDirigeant, IImmatriculationRNE } from '#models/immatriculation';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
  mandatairesRCS: Array<IDirigeant> | IAPINotRespondingError;
};

/**
 * Dirigeants from RCS section
 */
async function MandatairesRCSSection({
  uniteLegale,
  immatriculationRNE,
  mandatairesRCS,
}: IProps) {
  if (isAPI404(mandatairesRCS)) {
    return null;
  }

  return (
    <DataSection
      id="rne-dirigeants"
      title="Dirigeant(s)"
      isProtected
      notFoundInfo={null}
      sources={[EAdministration.INFOGREFFE]}
      data={mandatairesRCS}
    >
      {(mandatairesRCS) =>
        mandatairesRCS.length === 0 ? (
          <p>Cette entreprise ne possède aucun dirigeant.</p>
        ) : (
          <>
            {RCSDiffersFromRNE(mandatairesRCS, immatriculationRNE) && (
              <Warning>
                Le nombre de dirigeants enregistrés sur Infogreffe (ex-RCS)
                diffère de celui du RNE. Cette situation est anormale. Pour en
                savoir plus vous pouvez consulter la page de cette entreprise
                sur{' '}
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                  aria-label="Consulter la liste des dirigeants sur le site de l’INPI, nouvelle fenêtre"
                >
                  data.inpi.fr
                </a>{' '}
                ou sur{' '}
                <a
                  rel="noopener"
                  target="_blank"
                  href={`${routes.infogreffe.portail.entreprise}${uniteLegale.siren}`}
                  aria-label="Consulter la liste des dirigeants sur le site d’Infogreffe, nouvelle fenêtre"
                >
                  Infogreffe
                </a>
                .
              </Warning>
            )}
            <p>
              Cette entreprise possède {mandatairesRCS.length} mandataire(s)
              enregistrés sur <strong>Infogreffe</strong> (ex-RCS). Nous vous
              affichons cette liste en complément du RNE car elle permet
              d’accèder à la date de naissance complète des personnes physiques
              :
            </p>
            <DirigeantContent
              dirigeants={mandatairesRCS}
              isFallback={false}
              uniteLegale={uniteLegale}
            />
          </>
        )
      }
    </DataSection>
  );
}
export default MandatairesRCSSection;

function RCSDiffersFromRNE(
  mandatairesRCS: Array<IDirigeant>,
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError | IAPILoading
) {
  if (
    isAPILoading(immatriculationRNE) ||
    isAPINotResponding(immatriculationRNE)
  ) {
    return null;
  }
  return mandatairesRCS.length !== immatriculationRNE.dirigeants.length;
}
