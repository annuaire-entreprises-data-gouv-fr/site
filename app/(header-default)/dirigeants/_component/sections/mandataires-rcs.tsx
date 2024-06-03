import routes from '#clients/routes';
import { Info, Warning } from '#components-ui/alerts';
import { INPI } from '#components/administrations';
import { DataSection } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPILoading, isAPILoading } from '#models/api-loading';
import {
  IAPINotRespondingError,
  isAPINotResponding,
} from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDirigeant, IImmatriculationRNE } from '#models/immatriculation';
import { DirigeantContent } from './dirigeant-content';
import DirigeantsSection from './rne-dirigeants';

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
  return (
    <DataSection
      id="rne-dirigeants"
      title="Dirigeant(s)"
      isProtected
      notFoundInfo={null}
      sources={[EAdministration.INPI, EAdministration.INFOGREFFE]}
      data={mandatairesRCS}
    >
      {(mandatairesRCS) =>
        mandatairesRCS.length === 0 ? (
          <DirigeantsSection
            uniteLegale={uniteLegale}
            immatriculationRNE={immatriculationRNE}
          />
        ) : (
          <>
            <Info>
              Ces informations proviennent d’
              <a
                rel="noopener"
                target="_blank"
                href={`${routes.infogreffe.portail.home}`}
                aria-label="Visiter le site d’Infogreffe, nouvelle fenêtre"
              >
                Infogreffe
              </a>{' '}
              et incluent la date de naissance des dirigeant(e)s.
            </Info>
            <RCSDiffersFromRNE
              mandatairesRCS={mandatairesRCS}
              immatriculationRNE={immatriculationRNE}
              uniteLegale={uniteLegale}
            />
            <p>
              Cette entreprise possède {mandatairesRCS.length} dirigeant(s)
              enregistré(s) au RNE :
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

function RCSDiffersFromRNE({
  mandatairesRCS,
  immatriculationRNE,
  uniteLegale,
}: {
  mandatairesRCS: Array<IDirigeant>;
  immatriculationRNE:
    | IImmatriculationRNE
    | IAPINotRespondingError
    | IAPILoading;
  uniteLegale: IUniteLegale;
}) {
  if (
    isAPILoading(immatriculationRNE) ||
    isAPINotResponding(immatriculationRNE)
  ) {
    return null;
  }

  if (immatriculationRNE.dirigeants.length === mandatairesRCS.length) {
    return null;
  }

  return (
    <Warning>
      Les données d’Infogreffe sont issues du RNE mais il y a une différence
      entre le nombre de dirigeant(s) retourné(s) par l’
      <INPI />({immatriculationRNE.dirigeants.length}) et par Infogreffe (
      {mandatairesRCS.length}). Pour comparer, vous pouvez consulter la page de
      cette entreprise sur{' '}
      <a
        rel="noopener"
        target="_blank"
        href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
        aria-label="Consulter la liste des dirigeants sur le site de l’INPI, nouvelle fenêtre"
      >
        data.inpi.fr
      </a>
      .
    </Warning>
  );
}
