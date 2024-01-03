import { GetServerSideProps } from 'next';
import BreakPageForPrint from '#components-ui/print-break-page';
import BeneficiairesSection from '#components/dirigeants-section/beneficiaires';
import DirigeantsSection from '#components/dirigeants-section/rne-dirigeants';
import DirigeantSummary from '#components/dirigeants-section/summary';
import Meta from '#components/meta';
import { DonneesPriveesSection } from '#components/non-diffusible';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IUniteLegale } from '#models/index';
import { estDiffusible } from '#models/statut-diffusion';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { getCompanyPageDescription, getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isAgent } from '#utils/session';
import { useFetchImmatriculationRNE } from 'hooks';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const DirigeantsPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => {
  const immatriculationRNE = useFetchImmatriculationRNE(uniteLegale);
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
              <DirigeantsSection
                immatriculationRNE={immatriculationRNE}
                uniteLegale={uniteLegale}
              />
              <BreakPageForPrint />
              <BeneficiairesSection
                immatriculationRNE={immatriculationRNE}
                uniteLegale={uniteLegale}
              />
            </>
          ) : (
            <DonneesPriveesSection />
          )}
        </>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    const { slug, isBot } = extractParamsFromContext(context);
    return {
      props: {
        uniteLegale: await getUniteLegaleFromSlug(slug, { isBot }),
        metadata: {
          useReact: true,
        },
      },
    };
  }
);

export default DirigeantsPage;
