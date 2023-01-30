import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { Loader } from '#components-ui/loader';
import Meta from '#components/meta';
import Title, { FICHE } from '#components/title-section';
import { IUniteLegale } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isLoggedIn } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

const Test = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.setTimeout(() => setIsLoading(false), 3000);
  }, [setIsLoading]);

  return <>{isLoading ? <Loader /> : <span>Hello world !</span>}</>;
};

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const OctroiPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => {
  return (
    <>
      <Meta title={`Octroi - test`} noIndex={true} />
      <div className="content-container">
        <Title
          ficheType={FICHE.OCTROI}
          uniteLegale={uniteLegale}
          session={session}
        />
        <Test />
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
    const uniteLegale = await getUniteLegaleFromSlug(slug);

    return {
      props: {
        uniteLegale,
        metadata: { useReact: true },
      },
    };
  }
);

export default OctroiPage;
