import { GetServerSideProps } from 'next';
import React, { ReactElement } from 'react';
import connexionRefusedPicture from '#components-ui/illustrations/connexion-refused';
import ConnexionLayout from '#components/layouts/page-connexion';
import Meta from '#components/meta';
import { postServerSideProps } from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

const HabiliationFailure: NextPageWithLayout<{
  explanation: string;
  siren: string;
}> = ({ explanation, siren }) => (
  <>
    <Meta
      title="Vous ne pouvez pas accéder aux données privées de cette entreprise"
      noIndex={true}
    />
    <h1>Vous ne pouvez pas accéder aux données privées de cette entreprise</h1>
    {explanation && (
      <p>
        <h3>Pourquoi l’accés vous est refusé ?</h3>
        Selon nos informations : {explanation}
      </p>
    )}
    <div className="layout-left">
      <a href={`/entreprise/${siren}`}>
        ← Revenir à la fiche publique de cette entreprise
      </a>
    </div>
  </>
);

HabiliationFailure.getLayout = function getLayout(page: ReactElement) {
  return (
    <ConnexionLayout img={connexionRefusedPicture}>{page}</ConnexionLayout>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;
    //@ts-ignore
    const explanation = (context.query.why as string) || null;

    return {
      props: { siren, explanation },
    };
  }
);

export default HabiliationFailure;
