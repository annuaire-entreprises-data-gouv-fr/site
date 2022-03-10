import { GetServerSideProps } from 'next';
import React from 'react';
import { habilitationExplanations } from '../../../clients/dirigeant-insee/verify';
import connexionRefusedPicture from '../../../components/illustrations/connexion-refused';
import { withSession } from '../../../hocs/with-session';
import PageConnexion from '../../../layouts/page-connexion';
import { ISession } from '../../../utils/session/accessSession';

const HabiliationFailure: React.FC<{
  session: ISession;
  siren: string;
  why: string;
}> = ({ session, siren, why }) => {
  const explanation = habilitationExplanations[why];

  return (
    <PageConnexion
      title="Vous ne pouvez pas accéder aux données privées de cette entreprise"
      noIndex={true}
      session={session}
      img={connexionRefusedPicture}
    >
      <h1>
        Vous ne pouvez pas accéder aux données privées de cette entreprise
      </h1>
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
    </PageConnexion>
  );
};

export const getServerSideProps: GetServerSideProps = withSession(
  async (context) => {
    //@ts-ignore
    const siren = context.params.slug as string;
    //@ts-ignore
    const why = (context.query.why as string) || null;

    return {
      props: { siren, why },
    };
  }
);

export default HabiliationFailure;
