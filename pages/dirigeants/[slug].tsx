import { GetServerSideProps } from 'next';
import React from 'react';
import BreakPageForPrint from '#components-ui/print-break-page';
import { INPI, INSEE } from '#components/administrations';
import BeneficiairesSection from '#components/dirigeants-section/beneficiaires';
import DirigeantsEntrepriseIndividuelleSection from '#components/dirigeants-section/insee-dirigeant';
import DirigeantsSection from '#components/dirigeants-section/rncs-dirigeants';
import DirigeantSummary from '#components/dirigeants-section/summary';
import Meta from '#components/meta';
import { DirigeantsNonDiffusibleSection } from '#components/non-diffusible';
import { Section } from '#components/section';
import Title, { FICHE } from '#components/title-section';
import { EAdministration } from '#models/administrations';
import {
  getDirigeantsWithUniteLegaleFromSlug,
  IDirigeants,
} from '#models/dirigeants';
import { isServicePublic } from '#models/index';
import { estDiffusible } from '#models/statut-diffusion';
import {
  getCompanyPageDescription,
  getCompanyPageTitle,
} from '#utils/helpers/get-company-page-title';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, IDirigeants {}

const DirigeantsPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  immatriculationRNCS,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
        noIndex={true}
        title={`Dirigeants de la structure - ${getCompanyPageTitle(
          uniteLegale
        )}`}
        description={getCompanyPageDescription(uniteLegale)}
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
            immatriculationRNCS={immatriculationRNCS}
          />
          {estDiffusible(uniteLegale) ? (
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
              {uniteLegale.association.idAssociation && !uniteLegale.dirigeant && (
                <Section
                  id="rncs-dirigeants"
                  title="Dirigeant(e) d’association"
                  sources={[EAdministration.MI]}
                >
                  <p>
                    Nous n’avons pas retrouvé de dirigeants enreigstrés auprès
                    de l’
                    <INSEE /> ou auprès de <INPI />.
                  </p>
                  <p>
                    Si des dirigeants de cette strucure ont été déclarés auprès
                    du <a href="https://www.interieur.gouv.fr">MI</a>, vous les
                    retrouverez sur l&apos;onglet dirigeant de :{' '}
                    <a
                      target="_blank"
                      href={`https://www.data-asso.fr/annuaire/association/${uniteLegale.association.idAssociation}?docFields=documentsDac,documentsRna`}
                      rel="noreferrer"
                    >
                      data-asso
                    </a>{' '}
                  </p>
                </Section>
              )}
              {isServicePublic(uniteLegale) && !uniteLegale.dirigeant && (
                <Section
                  id="rncs-dirigeants"
                  title="Dirigeant(e) de service public"
                  sources={[EAdministration.DINUM]}
                >
                  <p>
                    Les administrations centrales, ministères et autres services
                    public, n&apos;ont pas de dirigeants enregistrés dans les
                    base de données de l’
                    <INSEE /> ou de <INPI />.
                  </p>
                </Section>
              )}
              <DirigeantsSection
                immatriculationRNCS={immatriculationRNCS}
                siren={uniteLegale.siren}
              />
              <BreakPageForPrint />
              <BeneficiairesSection
                immatriculationRNCS={immatriculationRNCS}
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
      props: await getDirigeantsWithUniteLegaleFromSlug(slug),
    };
  }
);

export default DirigeantsPage;
