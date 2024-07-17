import routes from '#clients/routes';
import { Info } from '#components-ui/alerts';
import { DataSectionClient } from '#components/section/data-section';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IDataFetchingState } from '#models/data-fetching';
import { IAssociationProtected } from '#models/espace-agent/association-protected';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  associationProtected:
    | IAssociationProtected
    | IAPINotRespondingError
    | IDataFetchingState;
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants for agents : either from Infogreffe or from RNE
 */
function DirigeantsAssociationProtectedSection({
  uniteLegale,
  associationProtected,
}: IProps) {
  return (
    <DataSectionClient
      id="rne-dirigeants"
      title="Dirigeant(s)"
      isProtected
      // @ts-ignore
      notFoundInfo={null}
      sources={[EAdministration.MI, EAdministration.DJEPVA]}
      data={associationProtected}
    >
      {(associationProtected) => (
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
      )}
    </DataSectionClient>
  );
}

export default DirigeantsAssociationProtectedSection;
