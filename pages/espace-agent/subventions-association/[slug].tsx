import { GetServerSideProps } from 'next';
import React from 'react';
import ProtectedData from '#components-ui/alerts/protected-data';
import { AssociationDocumentSection } from '#components/association-protected-section/documents';
import { AssociationStatutsSection } from '#components/association-protected-section/statuts';
import AssociationSection from '#components/association-section';
import Meta from '#components/meta';
import Title, { FICHE } from '#components/title-section';
import {
  getAssoSubventionsWithUniteLegaleFromSlug,
  ISubventionsAssociation,
} from '#models/espace-agent/subventions-association';
import { isAssociation } from '#models/index';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isLoggedIn } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata, ISubventionsAssociation {}

const SubventionsAssociationPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  subventionsDocuments,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        title={`Espace Agent Public - Subventions Association | Annuaire des Entreprises`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.AGENT_SUBVENTIONS}
          uniteLegale={uniteLegale}
          session={session}
        />
        <ProtectedData>
          Cette page contient des informations sensibles réservées aux{' '}
          <b>agents publics</b>.
        </ProtectedData>
        {isAssociation(uniteLegale) ? (
          <>
            <br />
            <AssociationSection uniteLegale={uniteLegale} />
            <AssociationStatutsSection
              uniteLegale={uniteLegale}
              subventionsDocuments={subventionsDocuments}
            />
            <br />
            <AssociationDocumentSection
              uniteLegale={uniteLegale}
              subventionsDocuments={subventionsDocuments}
            />
          </>
        ) : (
          <>
            <p>Cette structure n’est pas une association.</p>
            <br />
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    if (!isLoggedIn(context.req?.session)) {
      return {
        redirect: {
          destination: `/connexion/agent-public`,
          permanent: false,
        },
      };
    }

    const { slug } = extractParamsFromContext(context);
    const { uniteLegale, subventionsDocuments } =
      await getAssoSubventionsWithUniteLegaleFromSlug(slug);

    return {
      props: {
        uniteLegale,
        subventionsDocuments,
        metadata: { useReact: true },
      },
    };
  }
);

export default SubventionsAssociationPage;
