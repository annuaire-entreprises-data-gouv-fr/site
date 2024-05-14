import routes from '#clients/routes';
import InpiPartiallyDownWarning from '#components-ui/alerts-with-explanations/inpi-partially-down';
import { INPI } from '#components/administrations';
import { DataSectionServer } from '#components/section/data-section/server';
import { UniteLegalePageLink } from '#components/unite-legale-page-link';
import { EAdministration } from '#models/administrations/EAdministration';
import { IAPINotRespondingError } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import { IImmatriculationRNE } from '#models/immatriculation';
import { DirigeantContent } from './dirigeant-content';

type IProps = {
  immatriculationRNE: IImmatriculationRNE | IAPINotRespondingError;
  uniteLegale: IUniteLegale;
};

/**
 * Dirigeants section
 */
async function DirigeantsSection({ uniteLegale, immatriculationRNE }: IProps) {
  return (
    <DataSectionServer
      id="rne-dirigeants"
      title="Dirigeant(s)"
      sources={[EAdministration.INPI]}
      data={immatriculationRNE}
      notFoundInfo={
        <>
          Cette structure n’est pas enregistrée au{' '}
          <strong>Registre National des Entreprises (RNE)</strong>
        </>
      }
    >
      {(immatriculationRNE) => {
        const plural = immatriculationRNE.dirigeants.length > 1 ? 's' : '';
        return (
          <>
            {immatriculationRNE.metadata.isFallback &&
              immatriculationRNE.dirigeants.length > 0 && (
                <InpiPartiallyDownWarning />
              )}
            {immatriculationRNE.dirigeants.length === 0 ? (
              <p>
                Cette entreprise est enregistrée au{' '}
                <strong>Registre National des Entreprises (RNE)</strong>, mais
                n’y possède aucun dirigeant.
              </p>
            ) : (
              <>
                <p>
                  Cette entreprise possède{' '}
                  {immatriculationRNE.dirigeants.length} dirigeant{plural}{' '}
                  enregistré{plural} au{' '}
                  <strong>Registre National des Entreprises (RNE)</strong> tenu
                  par l’
                  <INPI />. Pour en savoir plus, vous pouvez consulter{' '}
                  <UniteLegalePageLink
                    href={`${routes.rne.portail.entreprise}${uniteLegale.siren}`}
                    uniteLegale={uniteLegale}
                    siteName="le site de l’INPI"
                  />
                  &nbsp;:
                </p>

                <DirigeantContent
                  dirigeants={immatriculationRNE.dirigeants}
                  isFallback={immatriculationRNE.metadata.isFallback}
                  uniteLegale={uniteLegale}
                />
              </>
            )}
          </>
        );
      }}
    </DataSectionServer>
  );
}

export default DirigeantsSection;
