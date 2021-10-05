import React from 'react';

import { GetServerSideProps, Redirect } from 'next';
import Page from '../../layouts';
import Title, { FICHE } from '../../components/title-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import DirigeantsEntrepriseIndividuelleSection from '../../components/dirigeants-section/entreprise-individuelle';
import {
  getDirigeantsWithUniteLegaleFromSlug,
  IDirigeants,
} from '../../models/dirigeants';
import DirigeantsSection from '../../components/dirigeants-section';
import BeneficiairesSection from '../../components/beneficiaires-section';
import { INPI, INSEE } from '../../components/administrations';
import { isAPINotResponding } from '../../models/api-not-responding';
import { isCaptchaCookieValid } from '../../utils/captcha';

const DirigeantsPage: React.FC<IDirigeants> = ({
  uniteLegale,
  dirigeants,
  beneficiaires,
}) => {
  const hasNoDirigeant =
    !uniteLegale.dirigeant &&
    isAPINotResponding(dirigeants) &&
    dirigeants.errorType === 404;

  return (
    <Page
      small={true}
      title={`Dirigeants de l’entité - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
      canonical={`https://annuaire-entreprises.data.gouv.fr/dirigeants/${uniteLegale.siren}`}
      noIndex={true}
    >
      <div className="content-container">
        <Title uniteLegale={uniteLegale} ficheType={FICHE.DIRIGEANTS} />
        {uniteLegale.estDiffusible ? (
          <>
            {hasNoDirigeant && (
              <p>
                Cette entreprise n’a pas de dirigeant enregistré, que ce soit
                auprès de l’
                <INSEE /> ou auprès de l’
                <INPI />.
              </p>
            )}
            {uniteLegale.estEntrepreneurIndividuel && uniteLegale.dirigeant && (
              <DirigeantsEntrepriseIndividuelleSection
                dirigeant={uniteLegale.dirigeant}
              />
            )}
            <DirigeantsSection
              dirigeants={dirigeants}
              siren={uniteLegale.siren}
            />
            <BeneficiairesSection
              beneficiaires={beneficiaires}
              siren={uniteLegale.siren}
            />
          </>
        ) : (
          <>
            <p>
              Cette entité est <b>non-diffusible.</b>
            </p>
            <NonDiffusibleSection />
          </>
        )}
      </div>
      <style jsx>{`
        .content-container {
          margin: 20px auto 40px;
        }
      `}</style>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const captchaCookieIsValid = isCaptchaCookieValid(context.req, context.res);
  if (!captchaCookieIsValid) {
    return {
      redirect: {
        destination: `/captcha?url=${context.req.url}`,
        permanent: false,
      },
    };
  }

  //@ts-ignore
  const slug = context.params.slug as string;
  try {
    return {
      props: await getDirigeantsWithUniteLegaleFromSlug(slug),
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, slug, context.req);
    return { props: {} };
  }
};

export default DirigeantsPage;
