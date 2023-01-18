import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import Meta from '#components/meta';
import Title, { FICHE } from '#components/title-section';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import { postServerSideProps } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';
import { Loader } from '#components-ui/loader';
import { IUniteLegale } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';

const Test = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('started');
    window.setTimeout(() => setIsLoading(false), 3000);
  }, [setIsLoading]);

  return <>{isLoading ? <Loader /> : <span>Hello world !</span>}</>;
};

const OctroiPage: NextPageWithLayout<{ uniteLegale: IUniteLegale }> = ({
  uniteLegale,
}) => {
  return (
    <>
      <Meta title={`Octroi - test`} noIndex={true} />
      <div className="content-container">
        <Title ficheType={FICHE.OCTROI} uniteLegale={uniteLegale} />
        <Test />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
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
