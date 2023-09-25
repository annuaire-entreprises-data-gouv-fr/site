import { GetServerSideProps } from 'next';
import BreakPageForPrint from '#components-ui/print-break-page';
import BeneficiairesSection from '#components/dirigeants-section/beneficiaires';
import DirigeantsEntrepriseIndividuelleSection from '#components/dirigeants-section/insee-dirigeant';
import DirigeantsSection from '#components/dirigeants-section/rne-dirigeants';
import DirigeantSummary from '#components/dirigeants-section/summary';
import Meta from '#components/meta';
import { DirigeantsNonDiffusibleSection } from '#components/non-diffusible';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IDirigeants } from '#models/dirigeants';
import { estDiffusible } from '#models/statut-diffusion';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { getCompanyPageDescription, getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent } from '#utils/session';
import useImmmatriculationRNE from 'hooks/use-immatriculation-RNE';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, IDirigeants {}

const DirigeantsPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => {
  const immatriculationRNE = useImmmatriculationRNE(uniteLegale);
  return (
    <>
      <Meta
        canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
        noIndex={true}
        title={`Dirigeants de la structure - ${getCompanyPageTitle(
          uniteLegale,
          session
        )}`}
        description={getCompanyPageDescription(uniteLegale, session)}
      />
      <div className="content-container">
        <Title
          uniteLegale={uniteLegale}
          ficheType={FICHE.DIRIGEANTS}
          session={session}
        />
        <>
          <DirigeantSummary
            uniteLegale={uniteLegale}
            immatriculationRNE={immatriculationRNE}
          />
          {estDiffusible(uniteLegale) || isAgent(session) ? (
            <>
              {uniteLegale.complements.estEntrepreneurIndividuel &&
                uniteLegale.dirigeant && (
                  <>
                    <DirigeantsEntrepriseIndividuelleSection
                      dirigeant={uniteLegale.dirigeant}
                    />
                    <BreakPageForPrint />
                  </>
                )}

              <DirigeantsSection
                immatriculationRNE={immatriculationRNE}
                siren={uniteLegale.siren}
              />
              <BreakPageForPrint />
              <BeneficiairesSection
                immatriculationRNE={immatriculationRNE}
                siren={uniteLegale.siren}
              />
            </>
          ) : (
            <DirigeantsNonDiffusibleSection />
          )}
        </>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug } = extractParamsFromContext(context);
    return {
      props: {
        uniteLegale: await getUniteLegaleFromSlug(slug, {}),
        immatriculationRNE: null,
        metadata: {
          useReact: true,
        },
      },
    };
  }
);

export default DirigeantsPage;
